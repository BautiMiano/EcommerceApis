package com.uade.EcommerceUniformes.marketplace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioService;

@RestController
@RequestMapping("usuarios")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> getUsuarios() {
        return usuarioService.getUsuario();
    }

    @GetMapping("/{usuarioId}")
    public Optional<Usuario> getUsuarioById(@PathVariable Long usuarioId) {
        return usuarioService.getUsuarioById(usuarioId);
    }

    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody UsuarioDto usuario) {
        Usuario resultado = usuarioService.createUsuario(usuario);

        if (resultado == null){
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.
                created(URI.create("usuarios/" + resultado.getId()))
                .body(resultado);
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> deleteUsuario (@PathVariable Long usuarioId) {
        usuarioService.deleteUsuario(usuarioId);

        return ResponseEntity.noContent().build();
    }
}
