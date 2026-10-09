package com.uade.EcommerceUniformes.marketplace.service.chat;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.dto.ConversacionDetalleResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ConversacionResumenResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatResponse;

public interface ChatService {

    ChatResponse responder(ChatRequest request);

    List<ConversacionResumenResponse> listarConversaciones();

    ConversacionDetalleResponse verConversacion(Long conversacionId);
}