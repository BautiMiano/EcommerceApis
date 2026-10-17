package com.uade.EcommerceUniformes.marketplace.service.chat;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

/**
 * Lee las instrucciones del bot, una por rol, una sola vez al arrancar.
 */
@Component
public class SystemPromptProvider {

    private final Map<RolChat, String> instrucciones;

    public SystemPromptProvider(ResourceLoader resourceLoader) {
        this.instrucciones = Map.of(
                RolChat.COMPRADOR, leer(resourceLoader, "classpath:prompts/system-comprador.txt"),
                RolChat.VENDEDOR, leer(resourceLoader, "classpath:prompts/system-vendedor.txt"));
    }

    /** Las instrucciones que corresponden al rol del usuario. */
    public String para(RolChat rol) {
        return instrucciones.get(rol);
    }

    /** Se mantiene para no romper el código que ya lo usa. */
    public String paraComprador() {
        return para(RolChat.COMPRADOR);
    }

    private static String leer(ResourceLoader resourceLoader, String ruta) {
        try (InputStream entrada = resourceLoader.getResource(ruta).getInputStream()) {
            return new String(entrada.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer " + ruta, e);
        }
    }
}