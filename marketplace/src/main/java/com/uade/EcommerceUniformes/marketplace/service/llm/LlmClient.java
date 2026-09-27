package com.uade.EcommerceUniformes.marketplace.service.llm;

/**
 * Contrato para hablar con un modelo de lenguaje.
 * El resto del proyecto depende de esta interfaz, no de Gemini.
 */
public interface LlmClient {

    /**
     * Manda un mensaje al modelo y devuelve su respuesta en texto.
     *
     * @param instrucciones cómo tiene que comportarse el bot
     * @param mensaje       lo que escribió el usuario
     */
    String generar(String instrucciones, String mensaje);
}