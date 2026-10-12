package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Favorito;
import com.uade.EcommerceUniformes.marketplace.service.FavoritoService;

@RestController
@RequestMapping("favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    // GET http://localhost:4002/favoritos/mis-favoritos
    @GetMapping("/mis-favoritos")
    public ResponseEntity<List<Favorito>> getMisFavoritos() {
        return ResponseEntity.ok(favoritoService.getMisFavoritos());
    }

    // POST http://localhost:4002/favoritos/5
    @PostMapping("/{productoId}")
    public ResponseEntity<Favorito> agregarFavorito(@PathVariable Long productoId) {
        Favorito favorito = favoritoService.agregarFavorito(productoId);
        return ResponseEntity.ok(favorito);
    }

    // DELETE http://localhost:4002/favoritos/5
    @DeleteMapping("/{productoId}")
    public ResponseEntity<String> eliminarFavorito(@PathVariable Long productoId) {
        favoritoService.eliminarFavorito(productoId);
        return ResponseEntity.ok("Producto eliminado de favoritos con id: " + productoId);
    }
}
