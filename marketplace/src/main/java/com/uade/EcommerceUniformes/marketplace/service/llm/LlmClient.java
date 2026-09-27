package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.RolMensaje;

public interface LlmClient {

    /**
     * Manda la conversación al modelo y devuelve su respuesta.
     *
     * @param instrucciones cómo tiene que comportarse el bot
     * @param mensajes      la conversación, del más viejo al más nuevo
     */
    String generar(String instrucciones, List<MensajeLlm> mensajes);

    /**
     * Atajo para un solo mensaje, sin historial.
     */
    default String generar(String instrucciones, String mensaje) {
        return generar(instrucciones, List.of(new MensajeLlm(RolMensaje.USER, mensaje)));
    }
}