package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.dto.OrdenDeCompraRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.VentaResponse;

public interface OrdenDeCompraService {

    List<OrdenDeCompra> getOrdenesDeCompra();

    Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId);

    List<OrdenDeCompra> getOrdenesDeCompraByUsuarioId();

    Optional<OrdenDeCompra> getMisOrdenesDeCompraById(Long ordenId);

    List<VentaResponse> getMisVentas();

    VentaResponse getMiVentaById(Long ordenId);


}