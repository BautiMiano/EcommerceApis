package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ItemVentaResponse {

    private Long productoId;
    private String nombreProducto;
    private String talle;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;
}
