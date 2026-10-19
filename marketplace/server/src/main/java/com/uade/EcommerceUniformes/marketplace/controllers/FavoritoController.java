package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Favorito;
import com.uade.EcommerceUniformes.marketplace.entity.dto.FavoritoResponse;
import com.uade.EcommerceUniformes.marketplace.service.FavoritoService;

@RestController
@RequestMapping("favoritos")
@CrossOrigin("http://localhost:5173")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    // GET http://localhost:4002/favoritos/mis-favoritos
    // En FavoritoController.java
@GetMapping("/mis-favoritos")
public ResponseEntity<List<FavoritoResponse>> getMisFavoritos() {
    return ResponseEntity.ok(favoritoService.getMisFavoritos());
}

    // POST http://localhost:4002/favoritos/5
    @PostMapping("/{productoId}")
    public ResponseEntity<Void> agregarFavorito(@PathVariable Long productoId) {
        favoritoService.agregarFavorito(productoId);
        return ResponseEntity.ok().build();
    }

    // DELETE http://localhost:4002/favoritos/5
    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long productoId) {
        favoritoService.eliminarFavorito(productoId);
        return ResponseEntity.ok().build();
    }
}