package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.dto.OrdenDeCompraRequest;

public interface OrdenDeCompraService {

    List<OrdenDeCompra> getOrdenesDeCompra();

    Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId);

    List<OrdenDeCompra> getOrdenesDeCompraByUsuarioId();

    Optional<OrdenDeCompra> getMisOrdenesDeCompraById(Long ordenId);


}