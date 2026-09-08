package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    // GET http://localhost:4002/productos
    @GetMapping
    public List<Producto> getProductos() {
        return this.productoService.getProductos();
    }

    // GET http://localhost:4002/productos/1
    @GetMapping("/{productoId}")
    public Producto getProductoById(@PathVariable Long productoId) {
        return this.productoService.getProductoById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));
    }

    // GET http://localhost:4002/productos/categoria/2
    @GetMapping("/categoria/{categoryId}")
    public List<Producto> getProductosByCategoria(@PathVariable Long categoryId) {
        return this.productoService.getProductosByCategoria(categoryId);
    }

    // POST http://localhost:4002/productos
    @PostMapping
    public Producto createProducto(@RequestBody ProductoRequest request) {
        return this.productoService.createProducto(request);
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> desactivarProducto(@PathVariable Long productoId, @RequestParam Long usuarioId) {

        productoService.desactivarProducto(productoId, usuarioId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{productoId}/activar")
    public ResponseEntity<Void> activarProducto(@PathVariable Long productoId, @RequestParam Long usuarioId) {

        productoService.activarProducto(productoId, usuarioId);

        return ResponseEntity.noContent().build();
    }
}