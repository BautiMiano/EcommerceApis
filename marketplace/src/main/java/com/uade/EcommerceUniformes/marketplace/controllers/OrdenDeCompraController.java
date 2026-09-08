package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.service.OrdenDeCompraService;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import org.springframework.security.core.Authentication;


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

    @GetMapping("/mis-ordenes")
    public List<OrdenDeCompra> getMisOrdenes (Authentication authentication){
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ordenDeCompraSerivice.getOrdenesDeCompraByUsuarioId(usuario.getId());
    }



}