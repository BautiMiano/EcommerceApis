package com.uade.EcommerceUniformes.marketplace.service.llm;

import com.uade.EcommerceUniformes.marketplace.entity.RolMensaje;

/**
 * Un mensaje de la conversación, en el formato que entiende el LlmClient.
 */
public record MensajeLlm(RolMensaje rol, String texto) {
}