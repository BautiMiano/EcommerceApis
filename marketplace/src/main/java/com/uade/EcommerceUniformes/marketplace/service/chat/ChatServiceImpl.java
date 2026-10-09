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
        this.herramientas = herramientas.stream()
                .collect(Collectors.toMap(ChatTool::nombre, Function.identity()));
    }

    @Override
    public ChatResponse responder(ChatRequest request) {
        String mensaje = validar(request);
        Usuario usuario = usuarioLogueadoService.obtenerUsuarioLogueado();
        RolChat rol = RolChat.de(usuario);
        Conversacion conversacion = obtenerOCrearConversacion(request.conversacionId(), usuario, mensaje);
        List<Map<String, Object>> contenidos = new ArrayList<>(cargarHistorial(conversacion));
        contenidos.add(Contenidos.texto(RolMensaje.USER, mensaje));

        String respuesta = conversar(contenidos, usuario, rol);

        guardarMensaje(conversacion, RolMensaje.USER, mensaje);
        guardarMensaje(conversacion, RolMensaje.MODEL, respuesta);
        conversacion.setActualizadaEn(LocalDateTime.now());
        conversacionRepository.save(conversacion);

        return new ChatResponse(conversacion.getId(), respuesta);
    }

    /** El título de la charla: el primer mensaje, recortado a 50 caracteres. */
    private String resumir(String mensaje) {
        return mensaje.length() <= 50 ? mensaje : mensaje.substring(0, 50) + "...";
    }

    /** El loop: llamar al modelo, ejecutar las herramientas que pida, repetir. */
    private String conversar(List<Map<String, Object>> contenidos, Usuario usuario, RolChat rol) {
        String instrucciones = systemPromptProvider.para(rol);
        List<Map<String, Object>> declaraciones = herramientasPara(rol).stream()
                .map(ChatTool::declaracion)
                .toList();

        for (int paso = 1; paso <= MAX_PASOS; paso++) {
            RespuestaLlm respuesta = llmClient.generarConHerramientas(instrucciones, contenidos, declaraciones);

            contenidos.add(respuesta.contenidoModelo());

            if (!respuesta.pideHerramientas()) {
                return respuesta.texto().isBlank() ? RESPUESTA_FALLBACK : respuesta.texto();
            }

            List<Object> resultados = new ArrayList<>();
            for (LlamadaHerramienta llamada : respuesta.llamadas()) {
                resultados.add(ejecutar(llamada, usuario, rol));
            }
            contenidos.add(Contenidos.resultadosHerramientas(respuesta.llamadas(), resultados));
        }

        log.warn("Se alcanzó el máximo de {} pasos sin respuesta final", MAX_PASOS);
        return RESPUESTA_FALLBACK;
    }

    /** Solo las herramientas habilitadas para este rol. */
    private List<ChatTool> herramientasPara(RolChat rol) {
        return herramientas.values().stream()
                .filter(h -> h.roles().contains(rol))
                .toList();
    }

    private Object ejecutar(LlamadaHerramienta llamada, Usuario usuario, RolChat rol) {
        log.info("[{}] Gemini pidió la herramienta {} con {}", rol, llamada.nombre(), llamada.args());

        ChatTool herramienta = herramientas.get(llamada.nombre());
        // Segunda barrera: aunque el modelo la pida, si no es de este rol, no se ejecuta
        if (herramienta == null || !herramienta.roles().contains(rol)) {
            log.warn("Herramienta {} rechazada para el rol {}", llamada.nombre(), rol);
            return Map.of("error", "La herramienta " + llamada.nombre() + " no está disponible");
        }
        try {
            return herramienta.ejecutar(llamada.args(), usuario);
        } catch (Exception e) {
            log.error("Error ejecutando {}", llamada.nombre(), e);
            return Map.of("error", "No se pudo completar la consulta");
        }
    }

    private Conversacion obtenerOCrearConversacion(Long conversacionId, Usuario usuario, String primerMensaje) {
        if (conversacionId == null) {
            Conversacion nueva = new Conversacion();
            nueva.setUsuario(usuario);
            nueva.setTitulo(resumir(primerMensaje));
            nueva.setCreadaEn(LocalDateTime.now());
            nueva.setActualizadaEn(LocalDateTime.now());
            return conversacionRepository.save(nueva);
        }
        return conversacionRepository.findByIdAndUsuarioId(conversacionId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Conversación no encontrada"));
    }

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