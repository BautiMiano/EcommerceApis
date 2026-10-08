package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;

/**
 * Lo que el bot ve de cada orden de compra.
 */
public record OrdenResultado(
        Long id,
        String fecha,
        String estado,
        String metodoDePago,
        double total,
        List<Item> items) {

    public record Item(String producto, String talle, int cantidad, double precioUnitario) {
    }
}