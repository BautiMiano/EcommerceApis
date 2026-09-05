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

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.dto.OrdenDeCompraRequest;
import com.uade.EcommerceUniformes.marketplace.service.OrdenDeCompraService;


@RestController
@RequestMapping("ordenesDeCompra")
public class OrdenDeCompraController {

    @Autowired
    private OrdenDeCompraService ordenDeCompraSerivice;

    @GetMapping
    public List<OrdenDeCompra> getOrdenesDeCompra() {
        return ordenDeCompraSerivice.getOrdenesDeCompra();
    }

    @GetMapping("/{ordenId}")
    public Optional<OrdenDeCompra> getOrdenDeCompraById(@PathVariable Long ordenId) {
        return ordenDeCompraSerivice.getOrdenDeCompraById(ordenId);
    }

    @PostMapping
    public ResponseEntity<OrdenDeCompra> createOrdenDeCompra(@RequestBody OrdenDeCompraRequest orden) {
        OrdenDeCompra resultado = ordenDeCompraSerivice.createOrdenDeCompra(orden); 
            return ResponseEntity.
                created(URI.create("ordenDeCompra/" + resultado.getId()))
                .body(resultado);  
    }


}