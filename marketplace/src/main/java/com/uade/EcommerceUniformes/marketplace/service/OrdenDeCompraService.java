package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;

public interface OrdenDeCompraService {

   public List<OrdenDeCompra> getOrdenesDeCompra();

    public Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId);

    public OrdenDeCompra createOrdenDeCompra(OrdenDeCompra orden);

    void deleteOrdenDeCompra(Long ordenId);
}