package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.util.List;
import java.util.Map;

import com.uade.EcommerceUniformes.marketplace.entity.RolMensaje;

public interface LlmClient {

    /**
     * Una llamada al modelo con herramientas disponibles.
     *
     * @param instrucciones cómo tiene que comportarse el bot
     * @param contenidos    la conversación, armada con la clase Contenidos
     * @param herramientas  las declaraciones de las herramientas (puede ser vacía)
     */
    RespuestaLlm generarConHerramientas(String instrucciones,
                                        List<Map<String, Object>> contenidos,
                                        List<Map<String, Object>> herramientas);

    /** Conversación sin herramientas: devuelve solo el texto. */
    default String generar(String instrucciones, List<MensajeLlm> mensajes) {
        List<Map<String, Object>> contenidos = mensajes.stream()
                .map(m -> Contenidos.texto(m.rol(), m.texto()))
                .toList();
        return generarConHerramientas(instrucciones, contenidos, List.of()).texto();
    }

    /** Atajo para un solo mensaje. */
    default String generar(String instrucciones, String mensaje) {
        return generar(instrucciones, List.of(new MensajeLlm(RolMensaje.USER, mensaje)));
    }
}