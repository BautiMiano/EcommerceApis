package com.uade.EcommerceUniformes.marketplace.controllers;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("usuarios")

public class UsuarioController {

    @GetMapping
    public ArrayList<Usuario> getUsuarios(){
        UsuarioService usuarioService = new UsuarioService();
        return usuarioService.
    }
}
