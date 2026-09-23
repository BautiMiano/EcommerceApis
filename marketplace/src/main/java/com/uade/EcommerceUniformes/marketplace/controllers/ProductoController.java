package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("productos")
@RequiredArgsConstructor

public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<Producto> getProductos() {
        return this.productoService.getProductos();
    }

    @GetMapping("/{productoId}")
    public Producto getProductoById(@PathVariable Long productoId) {
        return this.productoService.getProductoById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));
    }

    @GetMapping("{categoryId}{nombre}")
    public List<Producto> getProductosByCategoria(@PathVariable Long categoryId) {
        return this.productoService.getProductosByCategoria(categoryId);
    }

    @PostMapping
    public Producto createProducto(@RequestBody ProductoRequest request) {
        return this.productoService.createProducto(request);
    }

    @PatchMapping("/desactivar/{productoId}")
    public ResponseEntity<String> desactivarProducto(@PathVariable Long productoId) {

        productoService.desactivarProducto(productoId);

        return ResponseEntity.ok("Producto desactivado correctamente");
    }

    @PatchMapping("/activar/{productoId}")
    public ResponseEntity<String> activarProducto(@PathVariable Long productoId) {

        productoService.activarProducto(productoId);

        return ResponseEntity.ok("Producto activado correctamente");
    }

    @PatchMapping("/stock")
    public ResponseEntity<Void> modificarStock(
            @RequestBody ProductoRequest request) {

        productoService.modificarStock(request);

        return ResponseEntity.noContent().build();
    }
}
