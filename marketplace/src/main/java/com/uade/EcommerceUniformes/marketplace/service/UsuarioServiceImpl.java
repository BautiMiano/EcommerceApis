package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.UsuarioDto;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService{

    @Autowired
    private UsuarioRepository usuarioRepository;

   public List<Usuario> getUsuario(){
       return usuarioRepository.findAll();
   }
   public Optional<Usuario> getUsuarioById(Long id){
       return usuarioRepository.findById(id);
   }
   public Usuario createUsuario(UsuarioDto usuarioDto){
        List<Usuario> usuarios = usuarioRepository.findAll();
        if (usuarios.stream().anyMatch(usuario -> usuario.getMail().equals(usuarioDto.getMailDto())))
            throw new Error("El mail que se intenta agregar ya esta creado");
        if (usuarios.stream().anyMatch((usuario) -> usuario.getNombreUsuario().equals(usuarioDto.getNombreUsuarioDto())))
            throw new Error("El nombre de usuario que se intenta agregar ya esta creado");
        
        return usuarioRepository.save(new Usuario(usuarioDto.getNombreUsuarioDto(), usuarioDto.getNombreDto(), usuarioDto.getApellidoDto(), usuarioDto.getMailDto(), usuarioDto.getContrasenaDto(), usuarioDto.getRolUsuarioDto()));
   }
}
