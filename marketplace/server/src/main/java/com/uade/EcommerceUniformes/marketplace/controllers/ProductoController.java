package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("productos")
@CrossOrigin("http://localhost:5173")

@RequiredArgsConstructor

public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<ProductoRequest> getProductos() {
        return this.productoService.getProductos();
    }

    @GetMapping("/todos")
    public List<ProductoRequest> getTodosLosProductos() {
        return this.productoService.getTodosLosProductos();
    }

    @GetMapping("/{productoId}")
    public ProductoRequest getProductoById(@PathVariable Long productoId) {
        return this.productoService.getProductoById(productoId);
    }

    @GetMapping("/categoria/{categoryId}")
    public List<ProductoRequest> getProductosByCategoria(@PathVariable Long categoryId) {
        return this.productoService.getProductosByCategoria(categoryId);
    }

    @PostMapping
    public ProductoRequest createProducto(@RequestBody ProductoRequest request) {
        return this.productoService.createProducto(request);
    }

    @PutMapping("/{productoId}")
    public ProductoRequest updateProducto(
            @PathVariable Long productoId,
            @RequestBody ProductoRequest request) {
        return this.productoService.updateProducto(productoId, request);
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

    @GetMapping("/mis-productos")
    public List<ProductoRequest> getMisProductos() {
        return this.productoService.getMisProductos();
    }

    @GetMapping("/precio/{max}")
    public ResponseEntity<List<ProductoRequest>> getProductosByPrecioMax(@PathVariable Double max) {
        return ResponseEntity.ok(productoService.getProductosByPrecio(0.0, max));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoRequest>> buscarProductos(@RequestParam(name = "q") String q) {
        return ResponseEntity.ok(productoService.buscarProductosPorNombre(q));
    }

    @GetMapping("/talles")
    public ResponseEntity<List<String>> getTallesDisponibles() {
        return ResponseEntity.ok(productoService.getTallesDisponibles());
    }

    // Endpoint para buscar por talle individual
    @GetMapping("/talle/{talle}")
    public ResponseEntity<List<ProductoRequest>> getProductosByTalle(@PathVariable String talle) {
        return ResponseEntity.ok(productoService.getProductosByTalle(talle));
    }
}
