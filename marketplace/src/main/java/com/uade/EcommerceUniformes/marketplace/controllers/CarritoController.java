package com.uade.EcommerceUniformes.marketplace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.service.CarritoService;

@RestController
@RequestMapping("carritos")
public class CarritoController {
    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public List<Carrito> getCarritos() {
        return carritoService.getCarritos();
    }

    @GetMapping("/{carritoId}")
    public Optional<Carrito> getCarritoById(@PathVariable Long carritoId) {
        return carritoService.getCarritoById(carritoId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public Optional<Carrito> getCarritoByUsuarioId(@PathVariable Long usuarioId) {
        return carritoService.getCarritoByUsuarioId(usuarioId);
    }

    // POST http://localhost:4002/carritos/usuario/1
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<Object> createCarrito(@PathVariable Long usuarioId) {
        Carrito resultado = carritoService.createCarrito(usuarioId);
        return ResponseEntity
                .created(URI.create("/carritos/" + resultado.getId()))
                .body(resultado);
    }

    // POST http://localhost:4002/carritos/1/productos/5
    @PostMapping("/{carritoId}/productos/{productoId}")
    public ResponseEntity<Carrito> addProductoToCarrito(@PathVariable Long carritoId, @PathVariable Long productoId) {
        Carrito carritoActualizado = carritoService.addProductoToCarrito(carritoId, productoId);
        return ResponseEntity.ok(carritoActualizado);
    }
    // DELETE http://localhost:4002/carritos/1/productos/5
@DeleteMapping("/{carritoId}/productos/{productoId}")
public ResponseEntity<Carrito> removeProductoFromCarrito(@PathVariable Long carritoId, @PathVariable Long productoId) {
    Carrito carritoActualizado = carritoService.removeProductoFromCarrito(carritoId, productoId);
    return ResponseEntity.ok(carritoActualizado);
}
}