package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationRequest;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.EcommerceUniformes.marketplace.controllers.auth.RegisterRequest;
import com.uade.EcommerceUniformes.marketplace.controllers.config.JwtService;
import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (request.getRol() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe especificar un rol");
        }
        if (request.getRol() == Rol.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No se puede registrar un usuario con rol ADMIN");
        }
        if (usuarioRepository.findByMail(request.getMail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El mail que se intenta agregar ya esta creado");
        }
        if (usuarioRepository.findAll().stream().anyMatch((usuario) -> usuario.getNombreUsuario().equals(request.getNombreUsuario()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre de usuario que se intenta agregar ya esta creado");
        }

        Usuario usuario = new Usuario(
                request.getNombreUsuario(),
                request.getNombre(),
                request.getApellido(),
                request.getMail(),
                passwordEncoder.encode(request.getContrasena()),
                request.getRol(),
                null
            );

        if (request.getRol() == Rol.VENDEDOR) {
            usuario.setActivo(false);
        }

        usuarioRepository.save(usuario);

        if (request.getRol() == Rol.VENDEDOR) {
            return AuthenticationResponse.builder()
                    .usuarioId(usuario.getId())
                    .role(usuario.getRolUsuario().name())
                    .build();
        }

        if (request.getRol() == Rol.COMPRADOR) {

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        carrito.setEstado(EstadoCarrito.ARMADO);
        carritoRepository.save(carrito);

    }

        String jwtToken = jwtService.generateToken(usuario);

        return AuthenticationResponse.builder()
                .usuarioId(usuario.getId())
                .accessToken(jwtToken)
                .role(usuario.getRolUsuario().name()) 
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        Usuario vendedorPendiente = usuarioRepository.findByMail(request.getMail())
                .filter(u -> u.getRolUsuario() == Rol.VENDEDOR && !u.isActivo())
                .filter(u -> passwordEncoder.matches(request.getContrasena(), u.getContrasena()))
                .orElse(null);

        if (vendedorPendiente != null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Tu cuenta de vendedor todavía no está habilitada. Un administrador tiene que aprobarla.");
        }

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
                .usuarioId(usuario.getId())
                .accessToken(jwtToken)
                .role(usuario.getRolUsuario().name())
                .build();
    }
}
