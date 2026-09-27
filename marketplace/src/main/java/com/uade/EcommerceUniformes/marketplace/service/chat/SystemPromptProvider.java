package com.uade.EcommerceUniformes.marketplace.service.chat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

/**
 * Lee las instrucciones del bot desde resources/prompts al arrancar la app.
 */
@Component
public class SystemPromptProvider {

    private final String promptComprador;

    public SystemPromptProvider(
            @Value("classpath:prompts/system-comprador.txt") Resource archivo) throws IOException {
        this.promptComprador = archivo.getContentAsString(StandardCharsets.UTF_8);
    }

    public String paraComprador() {
        return promptComprador;
    }
}