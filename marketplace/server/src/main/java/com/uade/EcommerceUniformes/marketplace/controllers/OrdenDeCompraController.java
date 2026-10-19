package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CambioEstadoRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.VentaResponse;
import com.uade.EcommerceUniformes.marketplace.service.OrdenDeCompraService;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import org.springframework.security.core.Authentication;



@RestController
@RequestMapping("ordenesDeCompra")
@CrossOrigin ("http://localhost:5173")

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

    @GetMapping("/mis-ordenes")
    public List<OrdenDeCompra> getMisOrdenes (){
        return ordenDeCompraSerivice.getOrdenesDeCompraByUsuarioId();
    }

    @GetMapping("/mis-ordenes/{ordenId}")
    public Optional<OrdenDeCompra> getMisOrdenesDeCompraById(@PathVariable Long ordenId) {
        return ordenDeCompraSerivice.getMisOrdenesDeCompraById(ordenId);
    }

    @GetMapping("/mis-ventas")
    public List<VentaResponse> getMisVentas() {
        return ordenDeCompraSerivice.getMisVentas();
    }

    @GetMapping("/mis-ventas/{ordenId}")
    public VentaResponse getMiVentaById(@PathVariable Long ordenId) {
        return ordenDeCompraSerivice.getMiVentaById(ordenId);
    }

    @PatchMapping("/mis-ventas/{ordenId}/estado")
    public VentaResponse cambiarEstadoMiVenta(@PathVariable Long ordenId, @RequestBody CambioEstadoRequest request) {
        return ordenDeCompraSerivice.cambiarEstadoMiVenta(ordenId, request.getEstado());
    }



}