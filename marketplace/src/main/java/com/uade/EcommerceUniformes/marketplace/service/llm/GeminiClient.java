package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/**
 * Implementación de LlmClient que llama a la API de Gemini por HTTP.
 */
@Component
public class GeminiClient implements LlmClient {

    private final RestClient restClient;
    private final String modelo;

    public GeminiClient(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String modelo,
            @Value("${gemini.base-url}") String baseUrl) {
        this.modelo = modelo;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
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

        Map<String, Object> contenidoModelo = primerContenido(llamar(body));
        return interpretar(contenidoModelo);
    }

    private Map<String, Object> llamar(Map<String, Object> body) {
        try {
            return restClient.post()
                    .uri("/models/{modelo}:generateContent", modelo)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "No se pudo contactar al modelo: " + e.getMessage());
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