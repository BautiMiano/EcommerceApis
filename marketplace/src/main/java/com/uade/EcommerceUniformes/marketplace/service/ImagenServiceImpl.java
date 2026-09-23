package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Imagen;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.ImagenRepository;

@Service
public class ImagenServiceImpl implements ImagenService {

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    public Imagen createImagen(Imagen imagen) {
        return imagenRepository.save(imagen);
    }

    public Imagen viewById(Long id) {
        return imagenRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagen no encontrada con id: " + id));
    }

    public void desactivarImagen(Long id) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Imagen imagen = imagenRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Imagen no encontrada con id: " + id));

                boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;
        if (!imagen.getProducto().getVendedor().getId().equals(usuarioLogueado.getId()) && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para desactivar esta imagen");
        }


        if (!imagen.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La imagen ya está desactivada");
        }

        imagen.setActivo(false);

        imagenRepository.save(imagen);
    }

    public void activarImagen(Long id) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

        Imagen imagen = imagenRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Imagen no encontrada con id: " + id));
        if (!imagen.getProducto().getVendedor().getId().equals(usuarioLogueado.getId()) && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para activar esta imagen");
        }

        if (imagen.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La imagen ya está activada");
        }


        imagen.setActivo(true);

        imagenRepository.save(imagen);
    }

}
