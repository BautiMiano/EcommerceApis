package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ActualizarPerfilRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CambioContrasenaRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.PerfilResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;

public interface UsuarioService {

    public List<UsuarioDto> getUsuario();

    public UsuarioDto getUsuarioById(Long id);

    void desactivaUsuario (Long usuarioId);
    
    public void activarUsuario(Long usuarioId);


    public UsuarioDto cambiarRol(Long usuarioId, Rol nuevoRol);

    public PerfilResponse getMiPerfil();

    public AuthenticationResponse actualizarMiPerfil(ActualizarPerfilRequest request);

    public void cambiarMiContrasena(CambioContrasenaRequest request);

}