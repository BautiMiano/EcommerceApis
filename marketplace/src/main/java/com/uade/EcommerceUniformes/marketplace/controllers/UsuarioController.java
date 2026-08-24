package com.uade.EcommerceUniformes.marketplace.controllers;

import java.net.URI;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("usuarios")

public class UsuarioController {

   @Autowired
   private UsuarioService usuarioService;

   @GetMapping
   public List<Usuario> getUsuarios(){
       return usuarioService.getUsuario();
   }

   @GetMapping("/{usuarioId}")
   public Optional<Usuario> getUsuarioById (@PathVariable Long usuarioId){
       return usuarioService.getUsuarioById(usuarioId);
   }
   @PostMapping
   public ResponseEntity<Usuario> createUsuario(@RequestBody UsuarioDto usuario){
        Usuario resultado = usuarioService.createUsuario(usuario); 
        return ResponseEntity.
            created(URI.create("usuarios/" + resultado.getId()))
            .body(resultado);    
   }
}
