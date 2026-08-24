package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Comentario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ComentarioRequest;

import java.util.List;
import java.util.Optional;

public interface ComentarioService {

    List<Comentario> getComentarios();
    
    Optional<Comentario> getComentariosById(Long comentarioId);

    List<Comentario> getComentariosByProductoId(Long productoId);

    Comentario createComentario(ComentarioRequest request);
}