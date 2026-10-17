package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsuarioLogueadoServiceImpl implements UsuarioLogueadoService {
    
    private final UsuarioRepository usuarioRepository;

    public Usuario obtenerUsuarioLogueado() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String mail = authentication.getName();

        return usuarioRepository.findByMail(mail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado con mail: " + mail));
    }
}

