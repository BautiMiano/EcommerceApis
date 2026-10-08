package com.uade.EcommerceUniformes.marketplace.service.chat;

import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ChatResponse;

public interface ChatService {

    ChatResponse responder(ChatRequest request);
}