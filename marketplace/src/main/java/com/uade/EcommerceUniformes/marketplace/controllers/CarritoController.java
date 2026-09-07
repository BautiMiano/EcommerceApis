package com.uade.EcommerceUniformes.marketplace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    // POST http://localhost:4002/carritos/1/productos/5?cantidad=2
    @PostMapping("/{carritoId}/productos/{productoId}")
    public ResponseEntity<Carrito> addProductoToCarrito(
            @PathVariable Long carritoId,
            @PathVariable Long productoId,
            @RequestParam(defaultValue = "1") int cantidad) {
        Carrito carritoActualizado = carritoService.addProductoToCarrito(carritoId, productoId, cantidad);
        return ResponseEntity.ok(carritoActualizado);
    }

    // PUT http://localhost:4002/carritos/1/productos/5?cantidad=4
    @PutMapping("/{carritoId}/productos/{productoId}")
    public ResponseEntity<Carrito> updateCantidadProducto(
            @PathVariable Long carritoId,
            @PathVariable Long productoId,
            @RequestParam int cantidad) {
        Carrito carritoActualizado = carritoService.updateCantidadProducto(carritoId, productoId, cantidad);
        return ResponseEntity.ok(carritoActualizado);
    }

    // DELETE http://localhost:4002/carritos/1/productos/5
    @DeleteMapping("/{carritoId}/productos/{productoId}")
    public ResponseEntity<Carrito> removeProductoFromCarrito(@PathVariable Long carritoId, @PathVariable Long productoId) {
        Carrito carritoActualizado = carritoService.removeProductoFromCarrito(carritoId, productoId);
        return ResponseEntity.ok(carritoActualizado);
    }
    @PostMapping("/{carritoId}/pagar")
    public ResponseEntity<Carrito> iniciarPago(@PathVariable Long carritoId) {
    Carrito carritoActualizado = carritoService.iniciarPago(carritoId);
    return ResponseEntity.ok(carritoActualizado);
}

    @PostMapping("/{carritoId}/confirmar")
    public ResponseEntity<Carrito> confirmarPago(@PathVariable Long carritoId) {
    Carrito carritoActualizado = carritoService.confirmarPago(carritoId);
    return ResponseEntity.ok(carritoActualizado);
}
}