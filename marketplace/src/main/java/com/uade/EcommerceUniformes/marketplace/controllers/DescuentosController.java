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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Descuento;
import com.uade.EcommerceUniformes.marketplace.service.DescuentoService;

@RestController
@RequestMapping("descuentos")
public class DescuentosController {
    @Autowired
    private DescuentoService descuentoService;

    @GetMapping
    public List<Descuento> getDescuentos() {
        return descuentoService.getDescuentos();
    }

    @GetMapping("/{descuentoId}")
    public Optional<Descuento> getDescuentoById(@PathVariable Long descuentoId) {
        return descuentoService.getDescuentoById(descuentoId);
    }

    @PostMapping
    public ResponseEntity<Object> createDescuento(@RequestBody Descuento descuento) {
        Descuento resultado = descuentoService.createDescuento(descuento.getPorcentaje());
        return ResponseEntity
                .created(URI.create("/descuentos/" + resultado.getIdDescuento()))
                .body(resultado);
    }

    @PostMapping("/asignar-descuento/{descuentoId}")
    public ResponseEntity<Object> asignarDescuentoAProducto(@PathVariable Long descuentoId, 
        @RequestBody Long productoId) {
        descuentoService.asignarDescuentoAProducto(descuentoId, productoId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping ("/eliminar-descuento/producto/")
    public ResponseEntity<String> eliminarDescuentoDeProducto(@RequestBody Long productoId) {
        descuentoService.eliminarDescuentoDeProducto(productoId);
        return ResponseEntity.ok("Descuento eliminado del producto con id: " + productoId);
    }


}