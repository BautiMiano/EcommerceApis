package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    public List<Usuario> getUsuario();

    public Optional<Usuario> getUsuarioById(Long id);

    public Usuario createUsuario(UsuarioDto usuarioDto);

    void deleteUsuario (Long usuarioId);

}