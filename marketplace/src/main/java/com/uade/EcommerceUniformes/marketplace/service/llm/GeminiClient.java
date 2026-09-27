package com.uade.EcommerceUniformes.marketplace.service.llm;

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
import com.uade.EcommerceUniformes.marketplace.entity.RolMensaje;

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
    public String generar(String instrucciones, List<MensajeLlm> mensajes) {
        // Cada mensaje se convierte al formato de Gemini: { "role": ..., "parts": [ { "text": ... } ] }
        List<Map<String, Object>> contents = mensajes.stream()
                .map(m -> Map.<String, Object>of(
                        "role", m.rol() == RolMensaje.USER ? "user" : "model",
                        "parts", List.of(Map.of("text", m.texto()))))
                .toList();

        Map<String, Object> body = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", instrucciones))),
                "contents", contents);

        try {
            Map<String, Object> respuesta = restClient.post()
                    .uri("/models/{modelo}:generateContent", modelo)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            return extraerTexto(respuesta);

        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "No se pudo contactar al modelo: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String extraerTexto(Map<String, Object> respuesta) {
        List<Map<String, Object>> candidatos =
                respuesta == null ? null : (List<Map<String, Object>>) respuesta.get("candidates");

        if (candidatos == null || candidatos.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "El modelo no devolvió ninguna respuesta");
        }

        Map<String, Object> contenido = (Map<String, Object>) candidatos.get(0).get("content");
        List<Map<String, Object>> partes = (List<Map<String, Object>>) contenido.get("parts");

        StringBuilder texto = new StringBuilder();
        for (Map<String, Object> parte : partes) {
            Object t = parte.get("text");
            if (t != null) {
                texto.append(t);
            }
        }
        return texto.toString();
    }
}