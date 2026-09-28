package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.uade.EcommerceUniformes.marketplace.entity.RolMensaje;

/**
 * Arma los mensajes en el formato que espera Gemini.
 */
public final class Contenidos {

    private Contenidos() {
    }

    /** Un mensaje de texto del usuario o del modelo. */
    public static Map<String, Object> texto(RolMensaje rol, String texto) {
        return Map.of(
                "role", rol == RolMensaje.USER ? "user" : "model",
                "parts", List.of(Map.of("text", texto)));
    }

    /** Los resultados de las herramientas, en el mismo orden en que se pidieron. */
    public static Map<String, Object> resultadosHerramientas(List<LlamadaHerramienta> llamadas, List<Object> resultados) {
        List<Map<String, Object>> parts = new ArrayList<>();
        for (int i = 0; i < llamadas.size(); i++) {
            LlamadaHerramienta llamada = llamadas.get(i);
            Map<String, Object> respuesta = new LinkedHashMap<>();
            if (llamada.id() != null) {
                respuesta.put("id", llamada.id()); // Gemini lo usa para emparejar pedido y resultado
            }
            respuesta.put("name", llamada.nombre());
            respuesta.put("response", envolver(resultados.get(i)));
            parts.add(Map.of("functionResponse", respuesta));
        }
        return Map.of("role", "user", "parts", parts);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> envolver(Object resultado) {
        // Gemini exige que "response" sea un objeto JSON
        return resultado instanceof Map<?, ?> m
                ? (Map<String, Object>) m
                : Map.of("resultado", resultado);
    }
}