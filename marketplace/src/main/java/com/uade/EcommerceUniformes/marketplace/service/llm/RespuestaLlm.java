package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.util.List;
import java.util.Map;

/**
 * Respuesta de una llamada al modelo.
 *
 * @param contenidoModelo el mensaje del modelo tal cual vino (con su firma); se reenvía sin tocar
 * @param texto           el texto de la respuesta (vacío si solo pidió herramientas)
 * @param llamadas        las herramientas que pidió usar (vacío si respondió con texto)
 */
public record RespuestaLlm(Map<String, Object> contenidoModelo, String texto, List<LlamadaHerramienta> llamadas) {

    public boolean pideHerramientas() {
        return !llamadas.isEmpty();
    }
}