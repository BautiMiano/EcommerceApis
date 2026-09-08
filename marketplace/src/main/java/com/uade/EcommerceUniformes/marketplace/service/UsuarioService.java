package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;

public interface UsuarioService {

    public List<Usuario> getUsuario();

    public Optional<Usuario> getUsuarioById(Long id);

    public Usuario createUsuario(UsuarioDto usuarioDto);

    void deleteUsuario (Long usuarioId);
    
    public void activarUsuario(Long usuarioId);


    public Usuario cambiarRol(Long usuarioId, Rol nuevoRol);

}