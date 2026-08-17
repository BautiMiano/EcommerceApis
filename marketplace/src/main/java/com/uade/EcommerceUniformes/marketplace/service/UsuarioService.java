package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;

public class UsuarioService {

    public ArrayList<Usuario> getUsuario(){
        UsuarioRepository usuarioRepository = new UsuarioRepository();
        usuarioRepository.getUsuarios();
        return usuarioRepository.getUsuarios();
    }
    public String getUsuarioById(@PathVariable int usuarioId){
        return new String();
    }
    public String createUsuario(@RequestBody String usuario){
        return usuario;
    }
}
