package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.Favorito;

public interface FavoritoService {

    List<Favorito> getMisFavoritos();

    Favorito agregarFavorito(Long productoId);

    void eliminarFavorito(Long productoId);
}
