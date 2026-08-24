package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
import lombok.Data;

@Data

public class ProductoRequest {
    private String nombre;
    private String descripcion;
    private double precio;
    private String talle;
    private int stock;
    private String imagen;
    private EstadoProducto estado;
    private Long categoryId;
}
