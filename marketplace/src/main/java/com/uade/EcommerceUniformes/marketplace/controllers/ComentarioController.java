//package com.uade.EcommerceUniformes.marketplace.controllers;
//
//import com.uade.EcommerceUniformes.marketplace.entity.Comentario;
//import com.uade.EcommerceUniformes.marketplace.service.ComentarioService;
//import org.springframework.web.bind.annotation.*;
//import java.util.ArrayList;
//
//@RestController
//@RequestMapping("comentarios")
//public class ComentarioController {
//
//    // GET http://localhost:4002/comentarios
//    @GetMapping
//    public ArrayList<Comentario> getComentarios() {
//        ComentarioService comentarioService = new ComentarioService();
//        return comentarioService.getComentarios();
//    }
//
//    // GET http://localhost:4002/comentarios/producto/2
//    @GetMapping("/producto/{productoId}")
//    public ArrayList<Comentario> getComentariosByProductoId(@PathVariable int productoId) {
//        ComentarioService comentarioService = new ComentarioService();
//        return comentarioService.getComentariosByProductoId(productoId);
//    }
//
//    // POST http://localhost:4002/comentarios
//    @PostMapping
//    public Comentario createComentario(@RequestBody Comentario comentario) {
//        ComentarioService comentarioService = new ComentarioService();
//        return comentarioService.createComentario(comentario);
//    }
//}