package com.uade.EcommerceUniformes.marketplace.service.chat;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatResponse;
import com.uade.EcommerceUniformes.marketplace.service.llm.LlmClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final int LARGO_MAXIMO = 1000;

    private final LlmClient llmClient;
    private final SystemPromptProvider systemPromptProvider;

    @Override
    public ChatResponse responder(ChatRequest request) {
        String mensaje = validar(request);
        String respuesta = llmClient.generar(systemPromptProvider.paraComprador(), mensaje);
        return new ChatResponse(respuesta);
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