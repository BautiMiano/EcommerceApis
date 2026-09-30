package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioService;

@RestController
@RequestMapping("usuarios")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioDto> getUsuarios() {
        return usuarioService.getUsuario();
    }

    @GetMapping("/{usuarioId}")
    public UsuarioDto getUsuarioById(@PathVariable Long usuarioId) {
        return usuarioService.getUsuarioById(usuarioId);
    }




    @PatchMapping("/desactivar/{usuarioId}")
    public ResponseEntity<String> desactivaUsuario(@PathVariable Long usuarioId) {
        usuarioService.desactivaUsuario(usuarioId);

        return ResponseEntity.ok("Usuario desactivado correctamente");
    }

    @PatchMapping("/activar/{usuarioId}")
    public ResponseEntity<String> activarUsuario(@PathVariable Long usuarioId) {
        usuarioService.activarUsuario(usuarioId);
        return ResponseEntity.ok("Usuario activado correctamente");
    }

@PutMapping("/{usuarioId}")
public UsuarioDto cambiarRol(
        @PathVariable Long usuarioId,
        @RequestBody UsuarioDto usuarioDto) {

    return usuarioService.cambiarRol(usuarioId, usuarioDto.getRolUsuarioDto());
}
}
