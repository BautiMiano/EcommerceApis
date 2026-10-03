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

import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoResponse;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;
import com.uade.EcommerceUniformes.marketplace.service.CarritoService;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoRequest;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("carritos")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public List<CarritoResponse> getCarritos() {
        return carritoService.getCarritos();
    }

    @GetMapping("/{carritoId}")
    public Optional<CarritoResponse> getCarritoById(@PathVariable Long carritoId) {
        return carritoService.getCarritoById(carritoId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public Optional<CarritoResponse> getCarritoByUsuarioId(@PathVariable Long usuarioId) {
        return carritoService.getCarritoByUsuarioId(usuarioId);
    }

    @PostMapping("/{carritoId}/agregar-productos")
    public ResponseEntity<CarritoResponse> addProductoToCarrito(
            @PathVariable Long carritoId,
            @RequestBody CarritoRequest request) {

        CarritoResponse carritoActualizado =
                carritoService.addProductoToCarrito(carritoId, request);

        return ResponseEntity.ok(carritoActualizado);
    }

    @PutMapping("/{carritoId}/actualizar-cantidad")
    public ResponseEntity<CarritoResponse> updateCantidadProducto(
            @PathVariable Long carritoId,
            @RequestBody CarritoRequest request) {
        CarritoResponse carritoActualizado = carritoService.updateCantidadProducto(carritoId, request);
        return ResponseEntity.ok(carritoActualizado);
    }

    // DELETE http://localhost:4002/carritos/1/productos/5
    @DeleteMapping("/{carritoId}/eliminar-producto-carrito")
    public ResponseEntity<CarritoResponse> removeProductoFromCarrito(@PathVariable Long carritoId, @RequestBody CarritoRequest request) {
        CarritoResponse carritoActualizado = carritoService.removeProductoFromCarrito(carritoId, request);
        return ResponseEntity.ok(carritoActualizado);
    }

    @PostMapping("/{carritoId}/pagar")
    public ResponseEntity<CarritoResponse> iniciarPago(@PathVariable Long carritoId) {
        CarritoResponse carritoActualizado = carritoService.iniciarPago(carritoId);
        return ResponseEntity.ok(carritoActualizado);
    }

    @PostMapping("/{carritoId}/confirmar")
    public ResponseEntity<CarritoResponse> confirmarPago(@PathVariable Long carritoId, @RequestBody CarritoRequest request) {
        CarritoResponse carritoActualizado = carritoService.confirmarPago(carritoId, request);
        return ResponseEntity.ok(carritoActualizado);
    }
}
