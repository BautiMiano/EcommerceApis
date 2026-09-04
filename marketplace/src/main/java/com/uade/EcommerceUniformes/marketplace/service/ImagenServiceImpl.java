package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Imagen;
import com.uade.EcommerceUniformes.marketplace.repository.ImagenRepository;

@Service
public class ImagenServiceImpl implements ImagenService {

    @Autowired
    private ImagenRepository imagenRepository;

    public Imagen createImagen(Imagen imagen) {
        return imagenRepository.save(imagen);
    }

    public Imagen viewById(Long id) {
        return imagenRepository.findById(id).orElseThrow(() -> new Error("Imagen no encontrada con id: " + id));
    }

    public void desactivarImagen(Long id) {

        Imagen imagen = imagenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                "Imagen no encontrada con id: " + id
        ));
        imagen.setActivo(false);

        imagenRepository.save(imagen);
    }

}
