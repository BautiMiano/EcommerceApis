package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Imagen;
import org.springframework.stereotype.Service;


public interface  ImagenService {
    

    public Imagen createImagen(Imagen imagen);


    public Imagen viewById(Long id);

}
