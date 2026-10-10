package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.TicketChatRepository;
import com.uade.EcommerceUniformes.marketplace.service.chat.RolChat;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerMisTicketsTool implements ChatTool {

    private static final int MAX_RESULTADOS = 10;
    private static final int MAX_TEXTO = 200;

    private final TicketChatRepository ticketChatRepository;

    @Override
    public String nombre() {
        return "verMisTickets";
    }

    @Override
    public Set<RolChat> roles() {
        return Set.of(RolChat.VENDEDOR);
    }

    @Override
    public Map<String, Object> declaracion() {
        // Sin parámetros a propósito: siempre son los tickets del usuario logueado
        return Map.of(
                "name", nombre(),
                "description", "Devuelve los tickets de soporte del usuario logueado, del más nuevo al más "
                        + "viejo, con su asunto, estado, si ya fueron respondidos y la respuesta. Usala cuando "
                        + "pregunte por sus tickets, reclamos, consultas a soporte o si le respondieron.");
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        List<Ticket> todos = ticketChatRepository.findByUsuarioIdOrderByIdDesc(usuario.getId());

        long sinResponder = todos.stream().filter(t -> !respondido(t)).count();

        List<TicketResultado> tickets = todos.stream()
                .limit(MAX_RESULTADOS)
                .map(this::aResultado)
                .toList();

        return Map.of(
                "total", todos.size(),
                "sinResponder", sinResponder,
                "tickets", tickets);
    }

    private TicketResultado aResultado(Ticket t) {
        return new TicketResultado(
                t.getId(),
                t.getAsunto(),
                recortar(t.getMensaje()),
                t.getEstado() != null ? t.getEstado().name() : null,
                t.getFechaCreacion() != null ? t.getFechaCreacion().toString() : null,
                respondido(t),
                recortar(t.getRespuesta()),
                t.getFechaRespuesta() != null ? t.getFechaRespuesta().toString() : null);
    }

    /** Un ticket está respondido si tiene respuesta, sin depender de cómo se guardó el estado. */
    private boolean respondido(Ticket t) {
        return t.getRespuesta() != null && !t.getRespuesta().isBlank();
    }

    private String recortar(String texto) {
        if (texto == null || texto.length() <= MAX_TEXTO) {
            return texto;
        }
        return texto.substring(0, MAX_TEXTO) + "...";
    }
}