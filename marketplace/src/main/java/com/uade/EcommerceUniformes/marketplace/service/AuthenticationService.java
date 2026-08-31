package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationRequest;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.RegisterRequest;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;
import com.uade.EcommerceUniformes.marketplace.controllers.config.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        Usuario usuario = new Usuario(
                request.getNombreUsuario(),
                request.getNombre(),
                request.getApellido(),
                request.getMail(),
                passwordEncoder.encode(request.getContrasena()),
                Rol.COMPRADOR
        );

        usuarioRepository.save(usuario);

        String jwtToken = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getMail(),
                        request.getContrasena()
                )
        );
        Usuario usuario = usuarioRepository.findByMail(request.getMail())
                .orElseThrow();

        String jwtToken = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }
}
