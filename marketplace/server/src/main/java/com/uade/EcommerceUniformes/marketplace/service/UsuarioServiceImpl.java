package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.EcommerceUniformes.marketplace.controllers.config.JwtService;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ActualizarPerfilRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CambioContrasenaRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.PerfilResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // El mail es el usuario del JWT: si cambia, el token viejo deja de servir y se devuelve uno nuevo
    public AuthenticationResponse actualizarMiPerfil(ActualizarPerfilRequest request) {
        Usuario usuario = usuarioLogueadoService.obtenerUsuarioLogueado();

        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre no puede estar vacío");
        }
        if (request.getMail() == null || !request.getMail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El mail no es válido");
        }

        String mailNuevo = request.getMail().trim();
        boolean mailEnUso = usuarioRepository.findByMail(mailNuevo)
                .filter(otro -> !otro.getId().equals(usuario.getId()))
                .isPresent();
        if (mailEnUso) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ese mail ya está registrado");
        }

        usuario.setNombre(request.getNombre().trim());
        usuario.setApellido(request.getApellido() == null ? null : request.getApellido().trim());
        usuario.setMail(mailNuevo);
        usuarioRepository.save(usuario);

        return AuthenticationResponse.builder()
                .usuarioId(usuario.getId())
                .accessToken(jwtService.generateToken(usuario))
                .role(usuario.getRolUsuario().name())
                .build();
    }

    public void cambiarMiContrasena(CambioContrasenaRequest request) {
        Usuario usuario = usuarioLogueadoService.obtenerUsuarioLogueado();

        if (request.getContrasenaActual() == null
                || !passwordEncoder.matches(request.getContrasenaActual(), usuario.getContrasena())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual no es correcta");
        }
        if (request.getContrasenaNueva() == null || request.getContrasenaNueva().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nueva contraseña debe tener al menos 8 caracteres");
        }

        usuario.setContrasena(passwordEncoder.encode(request.getContrasenaNueva()));
        usuarioRepository.save(usuario);
    }

    public PerfilResponse getMiPerfil() {
        Usuario usuario = usuarioLogueadoService.obtenerUsuarioLogueado();

        return new PerfilResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getMail(),
                usuario.getRolUsuario());
    }

    public List<UsuarioDto> getUsuario() {

        List<Usuario> usuarios = usuarioRepository.findAll();

        if (usuarios.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No hay usuarios registrados"
            );
        }

        return usuarios.stream()
                .map(usuario -> {
                    UsuarioDto response = new UsuarioDto();
                    response.setNombreUsuarioDto(usuario.getNombreUsuario());
                    response.setApellidoDto(usuario.getApellido());
                    response.setIdDto(usuario.getId());
                    response.setMailDto(usuario.getMail());
                    response.setRolUsuarioDto(usuario.getRolUsuario());
                    response.setActivoDto(usuario.isActivo());

                    return response;
                })
                .toList();
    }

    public UsuarioDto getUsuarioById(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Usuario no encontrado con id: " + id
        ));

        UsuarioDto response = new UsuarioDto();

        response.setNombreUsuarioDto(usuario.getNombreUsuario());
        response.setApellidoDto(usuario.getApellido());
        response.setIdDto(usuario.getId());
        response.setMailDto(usuario.getMail());
        response.setRolUsuarioDto(usuario.getRolUsuario());
        response.setActivoDto(usuario.isActivo());

        return response;
    }

    public void desactivaUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + usuarioId));

        if (usuario.getRolUsuario() == Rol.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No se puede desactivar un usuario con rol ADMIN");
        }
        if (!usuario.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario ya está desactivado");
        }

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    public void activarUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + usuarioId));

        if (usuario.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario ya está activo");
        }

        usuario.setActivo(true);

        usuarioRepository.save(usuario);
    }

    public UsuarioDto cambiarRol(Long usuarioId, Rol nuevoRol) {

        if (nuevoRol == Rol.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No se puede asignar el rol ADMIN");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + usuarioId));

        if (usuario.getRolUsuario() == nuevoRol) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario ya tiene el rol asignado: " );
        }


        usuario.setRolUsuario(nuevoRol);

        usuarioRepository.save(usuario);

        UsuarioDto response = new UsuarioDto();
        response.setNombreUsuarioDto(usuario.getNombreUsuario());
        response.setMailDto(usuario.getMail());
        response.setApellidoDto(usuario.getApellido());
        response.setIdDto(usuario.getId());
        response.setRolUsuarioDto(usuario.getRolUsuario());

        return response;
    }
}
