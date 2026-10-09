package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ConversacionDetalleResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ConversacionResumenResponse;
import com.uade.EcommerceUniformes.marketplace.service.chat.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /** Mandar un mensaje (nueva charla o continuar una). */
    @PostMapping
    public ResponseEntity<ChatResponse> chatear(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.responder(request));
    }

    /** Lista de mis charlas, de la más reciente a la más vieja. */
    @GetMapping("/conversaciones")
    public ResponseEntity<List<ConversacionResumenResponse>> listarConversaciones() {
        return ResponseEntity.ok(chatService.listarConversaciones());
    }

    /** Todos los mensajes de una de mis charlas. */
    @GetMapping("/conversaciones/{id}")
    public ResponseEntity<ConversacionDetalleResponse> verConversacion(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.verConversacion(id));
    }
}