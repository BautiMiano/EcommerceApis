package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.Favorito;
import com.uade.EcommerceUniformes.marketplace.entity.dto.FavoritoResponse;

public interface FavoritoService {

    public List<FavoritoResponse> getMisFavoritos();

    Favorito agregarFavorito(Long productoId);

    void eliminarFavorito(Long productoId);
}
