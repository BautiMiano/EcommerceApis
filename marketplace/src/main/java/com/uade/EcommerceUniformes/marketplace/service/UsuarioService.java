package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;

public interface UsuarioService {

    public List<Usuario> getUsuario();

    public Optional<Usuario> getUsuarioById(Long id);

    void desactivaUsuario (Long usuarioId);
    
    public void activarUsuario(Long usuarioId);


    public Usuario cambiarRol(Long usuarioId, Rol nuevoRol);

}