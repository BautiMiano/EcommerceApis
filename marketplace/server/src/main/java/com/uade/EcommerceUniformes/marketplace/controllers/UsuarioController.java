package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ActualizarPerfilRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CambioContrasenaRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.PerfilResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioService;

@RestController
@RequestMapping("usuarios")
@CrossOrigin ("http://localhost:5173")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioDto> getUsuarios() {
        return usuarioService.getUsuario();
    }

    @GetMapping("/me")
    public PerfilResponse getMiPerfil() {
        return usuarioService.getMiPerfil();
    }

    // Devuelve un token nuevo, porque el mail es el usuario del JWT
    @PutMapping("/me")
    public AuthenticationResponse actualizarMiPerfil(@RequestBody ActualizarPerfilRequest request) {
        return usuarioService.actualizarMiPerfil(request);
    }

    @PatchMapping("/me/contrasena")
    public ResponseEntity<Void> cambiarMiContrasena(@RequestBody CambioContrasenaRequest request) {
        usuarioService.cambiarMiContrasena(request);
        return ResponseEntity.noContent().build();
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
