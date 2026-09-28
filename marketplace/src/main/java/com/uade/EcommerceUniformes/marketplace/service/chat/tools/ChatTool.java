package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.Map;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;

/**
 * Una herramienta que el bot puede pedir usar.
 */
public interface ChatTool {

    /** Nombre con el que Gemini la pide, ej: "buscarProductos". */
    String nombre();

    /** Descripción y parámetros, en el formato que entiende Gemini. */
    Map<String, Object> declaracion();

    /**
     * Ejecuta la herramienta. El usuario viene SIEMPRE del token,
     * nunca de los argumentos que manda el modelo.
     */
    Object ejecutar(Map<String, Object> args, Usuario usuario);
}