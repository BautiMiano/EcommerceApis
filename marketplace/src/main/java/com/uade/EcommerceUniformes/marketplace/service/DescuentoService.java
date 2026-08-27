package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Descuento;

public interface DescuentoService {
    public List<Descuento> getDescuentos();
    public Optional<Descuento> getDescuentoById(Long descuentoId);
    public Descuento createDescuento(double porcentaje);
}