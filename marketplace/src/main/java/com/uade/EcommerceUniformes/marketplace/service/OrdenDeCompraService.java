package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.dto.OrdenDeCompraRequest;

public interface OrdenDeCompraService {

   public List<OrdenDeCompra> getOrdenesDeCompra();

    public Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId);

    public List<OrdenDeCompra> getOrdenesDeCompraByUsuarioId(Long usuarioId);

}