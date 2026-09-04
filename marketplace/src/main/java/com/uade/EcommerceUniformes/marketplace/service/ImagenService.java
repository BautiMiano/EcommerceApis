package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Imagen;

public interface  ImagenService {
    

    public Imagen createImagen(Imagen imagen);


    public Imagen viewById(Long id);

    public void desactivarImagen(Long id);



}
