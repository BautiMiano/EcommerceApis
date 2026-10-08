package com.uade.EcommerceUniformes.marketplace.service.chat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Conversacion;
import com.uade.EcommerceUniformes.marketplace.entity.MensajeChat;
import com.uade.EcommerceUniformes.marketplace.entity.RolMensaje;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatResponse;
import com.uade.EcommerceUniformes.marketplace.repository.ConversacionRepository;
import com.uade.EcommerceUniformes.marketplace.repository.MensajeChatRepository;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioLogueadoService;
import com.uade.EcommerceUniformes.marketplace.service.chat.tools.ChatTool;
import com.uade.EcommerceUniformes.marketplace.service.llm.Contenidos;
import com.uade.EcommerceUniformes.marketplace.service.llm.LlamadaHerramienta;
import com.uade.EcommerceUniformes.marketplace.service.llm.LlmClient;
import com.uade.EcommerceUniformes.marketplace.service.llm.RespuestaLlm;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

    private static final int LARGO_MAXIMO = 1000;
    private static final int MAX_PASOS = 5;
    private static final String RESPUESTA_FALLBACK =
            "Perdón, no pude resolver tu consulta. ¿Podés reformularla?";

    private final LlmClient llmClient;
    private final SystemPromptProvider systemPromptProvider;
    private final UsuarioLogueadoService usuarioLogueadoService;
    private final ConversacionRepository conversacionRepository;
    private final MensajeChatRepository mensajeChatRepository;
    private final Map<String, ChatTool> herramientas;

    public ChatServiceImpl(LlmClient llmClient,
                           SystemPromptProvider systemPromptProvider,
                           UsuarioLogueadoService usuarioLogueadoService,
                           ConversacionRepository conversacionRepository,
                           MensajeChatRepository mensajeChatRepository,
                           List<ChatTool> herramientas) {
        this.llmClient = llmClient;
        this.systemPromptProvider = systemPromptProvider;
        this.usuarioLogueadoService = usuarioLogueadoService;
        this.conversacionRepository = conversacionRepository;
        this.mensajeChatRepository = mensajeChatRepository;
        // Spring inyecta todas las clases que implementan ChatTool; las indexamos por nombre
        this.herramientas = herramientas.stream()
                .collect(Collectors.toMap(ChatTool::nombre, Function.identity()));
    }

    @Override
    public ChatResponse responder(ChatRequest request) {
        String mensaje = validar(request);
        Usuario usuario = usuarioLogueadoService.obtenerUsuarioLogueado();
        Conversacion conversacion = obtenerOCrearConversacion(request.conversacionId(), usuario);

        List<Map<String, Object>> contenidos = new ArrayList<>(cargarHistorial(conversacion));
        contenidos.add(Contenidos.texto(RolMensaje.USER, mensaje));

        String respuesta = conversar(contenidos, usuario);

        guardarMensaje(conversacion, RolMensaje.USER, mensaje);
        guardarMensaje(conversacion, RolMensaje.MODEL, respuesta);
        conversacion.setActualizadaEn(LocalDateTime.now());
        conversacionRepository.save(conversacion);

        return new ChatResponse(conversacion.getId(), respuesta);
    }

    /** El loop: llamar al modelo, ejecutar las herramientas que pida, repetir. */
    private String conversar(List<Map<String, Object>> contenidos, Usuario usuario) {
        List<Map<String, Object>> declaraciones = herramientas.values().stream()
                .map(ChatTool::declaracion)
                .toList();

        for (int paso = 1; paso <= MAX_PASOS; paso++) {
            RespuestaLlm respuesta = llmClient.generarConHerramientas(
                    systemPromptProvider.paraComprador(), contenidos, declaraciones);

            // El mensaje del modelo se agrega TAL CUAL vino (con su firma)
            contenidos.add(respuesta.contenidoModelo());

            if (!respuesta.pideHerramientas()) {
                return respuesta.texto().isBlank() ? RESPUESTA_FALLBACK : respuesta.texto();
            }

            List<Object> resultados = new ArrayList<>();
            for (LlamadaHerramienta llamada : respuesta.llamadas()) {
                resultados.add(ejecutar(llamada, usuario));
            }
            contenidos.add(Contenidos.resultadosHerramientas(respuesta.llamadas(), resultados));
        }

        log.warn("Se alcanzó el máximo de {} pasos sin respuesta final", MAX_PASOS);
        return RESPUESTA_FALLBACK;
    }

    private Object ejecutar(LlamadaHerramienta llamada, Usuario usuario) {
        log.info("Gemini pidió la herramienta {} con {}", llamada.nombre(), llamada.args());

        ChatTool herramienta = herramientas.get(llamada.nombre());
        if (herramienta == null) {
            return Map.of("error", "La herramienta " + llamada.nombre() + " no existe");
        }
        try {
            // El usuario viene del token, nunca de los argumentos del modelo
            return herramienta.ejecutar(llamada.args(), usuario);
        } catch (Exception e) {
            log.error("Error ejecutando {}", llamada.nombre(), e);
            return Map.of("error", "No se pudo completar la consulta");
        }
    }

    private Conversacion obtenerOCrearConversacion(Long conversacionId, Usuario usuario) {
        if (conversacionId == null) {
            Conversacion nueva = new Conversacion();
            nueva.setUsuario(usuario);
            nueva.setCreadaEn(LocalDateTime.now());
            nueva.setActualizadaEn(LocalDateTime.now());
            return conversacionRepository.save(nueva);
        }
        return conversacionRepository.findByIdAndUsuarioId(conversacionId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Conversación no encontrada"));
    }

    /** Solo texto: los pasos de herramientas de mensajes viejos no se guardan ni se reenvían. */
    private List<Map<String, Object>> cargarHistorial(Conversacion conversacion) {
        return mensajeChatRepository.findTop10ByConversacionIdOrderByIdDesc(conversacion.getId())
                .reversed()
                .stream()
                .map(m -> Contenidos.texto(m.getRol(), m.getTexto()))
                .toList();
    }

    private void guardarMensaje(Conversacion conversacion, RolMensaje rol, String texto) {
        MensajeChat m = new MensajeChat();
        m.setConversacion(conversacion);
        m.setRol(rol);
        m.setTexto(texto);
        m.setCreadoEn(LocalDateTime.now());
        mensajeChatRepository.save(m);
    }

    private String validar(ChatRequest request) {
        if (request == null || request.mensaje() == null || request.mensaje().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El mensaje no puede estar vacío");
        }
        String mensaje = request.mensaje().trim();
        if (mensaje.length() > LARGO_MAXIMO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El mensaje no puede superar los " + LARGO_MAXIMO + " caracteres");
        }
        return mensaje;
    }
}