package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationRequest;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.RegisterRequest;
import com.uade.EcommerceUniformes.marketplace.controllers.config.JwtService;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (request.getRol() == null) {
            throw new RuntimeException("Debe especificar un rol");
        }
        if (request.getRol() == Rol.ADMIN) {
            throw new RuntimeException("No se puede registrar un usuario con rol ADMIN");
        }
        if (usuarioRepository.findByMail(request.getMail()).isPresent()) {
            throw new RuntimeException("El mail que se intenta agregar ya esta creado");
        }
        if (usuarioRepository.findAll().stream().anyMatch((usuario) -> usuario.getNombreUsuario().equals(request.getNombreUsuario()))) {
            throw new RuntimeException("El nombre de usuario que se intenta agregar ya esta creado");
        }

        Usuario usuario = new Usuario(
                request.getNombreUsuario(),
                request.getNombre(),
                request.getApellido(),
                request.getMail(),
                passwordEncoder.encode(request.getContrasena()),
                request.getRol()
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
