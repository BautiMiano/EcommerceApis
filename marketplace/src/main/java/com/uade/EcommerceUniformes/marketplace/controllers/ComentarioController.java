package com.uade.EcommerceUniformes.marketplace.controllers;

import com.uade.EcommerceUniformes.marketplace.entity.Comentario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ComentarioRequest;
import com.uade.EcommerceUniformes.marketplace.service.ComentarioService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;


import java.util.List;

@RestController
@RequestMapping("comentarios")
@RequiredArgsConstructor

public class ComentarioController {

    private final ComentarioService comentarioService;

    // GET http://localhost:4002/comentarios
    @GetMapping
    public List<Comentario> getComentarios() {
        return comentarioService.getComentarios();
    }

    // GET http://localhost:4002/comentarios/producto/2
    @GetMapping("/producto/{productoId}")
    public List<Comentario> getComentariosByProductoId(@PathVariable Long productoId) {
        return comentarioService.getComentariosByProductoId(productoId);
    }
    
    // GET http://localhost:4002/comentarios/1
    @GetMapping("/{comentarioId}")
    public Comentario getComentariosById(@PathVariable Long comentarioId) {
        return comentarioService.getComentariosById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado con id: " + comentarioId));
    }

    // POST http://localhost:4002/comentarios
    @PostMapping
    public Comentario createComentario(@RequestBody ComentarioRequest comentarioRequest) {
        return comentarioService.createComentario(comentarioRequest);
    }
}