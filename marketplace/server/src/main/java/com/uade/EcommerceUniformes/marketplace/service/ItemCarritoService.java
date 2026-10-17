package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;
import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;

public interface ItemCarritoService {
    public List<ItemCarrito> getItemsByCarritoId(Long carritoId);
    public Optional<ItemCarrito> getItemById(Long itemId);
    public double calcularSubtotal(Long itemId);
}