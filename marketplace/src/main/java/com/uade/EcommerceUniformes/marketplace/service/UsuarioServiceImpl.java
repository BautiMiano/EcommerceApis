package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getUsuario() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUsuarioById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario createUsuario(UsuarioDto usuarioDto) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        if (usuarios.stream().anyMatch(usuario -> usuario.getMail().equals(usuarioDto.getMailDto()))) {
            throw new RuntimeException("El mail que se intenta agregar ya esta creado");
        }
        if (usuarios.stream().anyMatch((usuario) -> usuario.getNombreUsuario().equals(usuarioDto.getNombreUsuarioDto()))) {
            throw new RuntimeException("El nombre de usuario que se intenta agregar ya esta creado");
        }
        if (usuarioDto.getRolUsuarioDto() == Rol.ADMIN) {
            throw new RuntimeException("No se puede crear un usuario con rol ADMIN");
        }

        return usuarioRepository.save(new Usuario(usuarioDto.getNombreUsuarioDto(), usuarioDto.getNombreDto(), usuarioDto.getApellidoDto(), usuarioDto.getMailDto(), usuarioDto.getContrasenaDto(), usuarioDto.getRolUsuarioDto()));
    }

    public void deleteUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));
        usuarioRepository.delete(usuario);
    }

    public Usuario cambiarRol(Long usuarioId, Rol nuevoRol) {

        if (nuevoRol == Rol.ADMIN) {
            throw new RuntimeException("No se puede asignar el rol ADMIN desde este endpoint");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setRolUsuario(nuevoRol);

        return usuarioRepository.save(usuario);
    }
}