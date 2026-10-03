package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ItemCarritoResponse {

    private Long productoId;
    private String nombreProducto;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;
}