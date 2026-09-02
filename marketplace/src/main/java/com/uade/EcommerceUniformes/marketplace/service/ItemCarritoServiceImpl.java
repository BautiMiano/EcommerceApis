package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;
import com.uade.EcommerceUniformes.marketplace.repository.ItemCarritoRepository;

@Service
public class ItemCarritoServiceImpl implements ItemCarritoService {
    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

    public List<ItemCarrito> getItemsByCarritoId(Long carritoId) {
        return itemCarritoRepository.findByCarritoId(carritoId);
    }

    public Optional<ItemCarrito> getItemById(Long itemId) {
        return itemCarritoRepository.findById(itemId);
    }

    public double calcularSubtotal(Long itemId) {
        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new Error("Item no encontrado con id: " + itemId));
        return item.getCantidad() * item.getPrecioUnitario();
    }
}