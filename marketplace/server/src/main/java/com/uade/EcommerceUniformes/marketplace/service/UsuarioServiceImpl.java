package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
        response.setRolUsuarioDto(usuario.getRolUsuario());

        return response;
    }
}
