package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;

/**
 * Implementación de LlmClient que llama a la API de Gemini por HTTP.
 * Reintenta ante saturación (429 y 503) con espera creciente.
 */
@Slf4j
@Component
public class GeminiClient implements LlmClient {

    private static final int MAX_REINTENTOS = 2;
    private static final long ESPERA_INICIAL_MS = 1000;

    private final RestClient restClient;
    private final String modelo;

    public GeminiClient(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String modelo,
            @Value("${gemini.base-url}") String baseUrl) {
        this.modelo = modelo;

        // Tiempos máximos: 5 s para conectarse y 30 s para recibir la respuesta
        SimpleClientHttpRequestFactory tiempos = new SimpleClientHttpRequestFactory();
        tiempos.setConnectTimeout(Duration.ofSeconds(5));
        tiempos.setReadTimeout(Duration.ofSeconds(30));

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(tiempos)
                .defaultHeader("x-goog-api-key", apiKey)
                .build();
    }

    @Override
    public RespuestaLlm generarConHerramientas(String instrucciones,
                                               List<Map<String, Object>> contenidos,
                                               List<Map<String, Object>> herramientas) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("system_instruction", Map.of("parts", List.of(Map.of("text", instrucciones))));
        body.put("contents", contenidos);
        if (!herramientas.isEmpty()) {
            body.put("tools", List.of(Map.of("functionDeclarations", herramientas)));
        }

        Map<String, Object> contenidoModelo = primerContenido(llamarConReintentos(body));
        return interpretar(contenidoModelo);
    }

    private Map<String, Object> llamarConReintentos(Map<String, Object> body) {
        long espera = ESPERA_INICIAL_MS;

        for (int intento = 0; ; intento++) {
            try {
                return llamar(body);
            } catch (RestClientResponseException e) {
                int codigo = e.getStatusCode().value();
                boolean saturado = codigo == 429 || codigo == 503;

                if (!saturado) {
                    // Errores que no se arreglan reintentando (clave inválida, modelo inexistente...)
                    log.error("Gemini respondió {}: {}", codigo, e.getResponseBodyAsString());
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                            "El asistente no está disponible en este momento");
                }
                if (intento >= MAX_REINTENTOS) {
                    log.warn("Gemini sigue saturado ({}) después de {} reintentos", codigo, MAX_REINTENTOS);
                    throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                            "El asistente tiene mucha demanda. Probá de nuevo en unos minutos.");
                }
                log.warn("Gemini respondió {}. Reintento {} de {} en {} ms",
                        codigo, intento + 1, MAX_REINTENTOS, espera);
                esperar(espera);
                espera *= 2; // espera creciente: 1 s, 2 s...
            } catch (RestClientException e) {
                // Sin respuesta: no se pudo conectar o se pasó el tiempo máximo
                log.error("No se pudo contactar a Gemini: {}", e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "No se pudo contactar al asistente");
            }
        }
    }

    private Map<String, Object> llamar(Map<String, Object> body) {
        return restClient.post()
                .uri("/models/{modelo}:generateContent", modelo)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    private void esperar(long milisegundos) {
        try {
            Thread.sleep(milisegundos);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Se interrumpió la espera");
        }
    }

    /** Saca el mensaje del modelo de: { "candidates": [ { "content": {...} } ] } */
    @SuppressWarnings("unchecked")
    private Map<String, Object> primerContenido(Map<String, Object> respuesta) {
        List<Map<String, Object>> candidatos =
                respuesta == null ? null : (List<Map<String, Object>>) respuesta.get("candidates");
        if (candidatos == null || candidatos.isEmpty() || candidatos.get(0).get("content") == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "El modelo no devolvió ninguna respuesta");
        }
        return (Map<String, Object>) candidatos.get(0).get("content");
    }

    /** Recorre TODAS las partes: pueden venir textos y pedidos de herramientas mezclados. */
    @SuppressWarnings("unchecked")
    private RespuestaLlm interpretar(Map<String, Object> contenido) {
        StringBuilder texto = new StringBuilder();
        List<LlamadaHerramienta> llamadas = new ArrayList<>();

        List<Map<String, Object>> partes =
                (List<Map<String, Object>>) contenido.getOrDefault("parts", List.of());

        for (Map<String, Object> parte : partes) {
            if (parte.get("functionCall") instanceof Map<?, ?> fc) {
                Map<String, Object> args = fc.get("args") instanceof Map<?, ?> a
                        ? (Map<String, Object>) a
                        : Map.of();
                llamadas.add(new LlamadaHerramienta(
                        (String) fc.get("id"),
                        (String) fc.get("name"),
                        args));
            } else if (parte.get("text") instanceof String t && !Boolean.TRUE.equals(parte.get("thought"))) {
                texto.append(t);
            }
        }
        return new RespuestaLlm(contenido, texto.toString(), llamadas);
    }
}