package com.uade.EcommerceUniformes.marketplace.service.chat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
import com.uade.EcommerceUniformes.marketplace.service.llm.LlmClient;
import com.uade.EcommerceUniformes.marketplace.service.llm.MensajeLlm;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final int LARGO_MAXIMO = 1000;

    private final LlmClient llmClient;
    private final SystemPromptProvider systemPromptProvider;
    private final UsuarioLogueadoService usuarioLogueadoService;
    private final ConversacionRepository conversacionRepository;
    private final MensajeChatRepository mensajeChatRepository;

    @Override
    public ChatResponse responder(ChatRequest request) {
        String mensaje = validar(request);
        Usuario usuario = usuarioLogueadoService.obtenerUsuarioLogueado();
        Conversacion conversacion = obtenerOCrearConversacion(request.conversacionId(), usuario);

        // Historial previo + el mensaje nuevo
        List<MensajeLlm> mensajes = new ArrayList<>(cargarHistorial(conversacion));
        mensajes.add(new MensajeLlm(RolMensaje.USER, mensaje));

        String respuesta = llmClient.generar(systemPromptProvider.paraComprador(), mensajes);

        // Se guardan recién cuando Gemini respondió bien: así siempre quedan en pares
        guardarMensaje(conversacion, RolMensaje.USER, mensaje);
        guardarMensaje(conversacion, RolMensaje.MODEL, respuesta);
        conversacion.setActualizadaEn(LocalDateTime.now());
        conversacionRepository.save(conversacion);

        return new ChatResponse(conversacion.getId(), respuesta);
    }

    private Conversacion obtenerOCrearConversacion(Long conversacionId, Usuario usuario) {
        if (conversacionId == null) {
            Conversacion nueva = new Conversacion();
            nueva.setUsuario(usuario);
            nueva.setCreadaEn(LocalDateTime.now());
            nueva.setActualizadaEn(LocalDateTime.now());
            return conversacionRepository.save(nueva);
        }
        // Solo la encuentra si es de este usuario
        return conversacionRepository.findByIdAndUsuarioId(conversacionId, usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Conversación no encontrada"));
    }

    private List<MensajeLlm> cargarHistorial(Conversacion conversacion) {
        // Vienen del más nuevo al más viejo; los damos vuelta para Gemini
        return mensajeChatRepository.findTop10ByConversacionIdOrderByIdDesc(conversacion.getId())
                .reversed()
                .stream()
                .map(m -> new MensajeLlm(m.getRol(), m.getTexto()))
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