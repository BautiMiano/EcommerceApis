package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
import lombok.AllArgsConstructor;

import lombok.Data;
@AllArgsConstructor
@Data
public class ProductoRequest {

    private Long id;

    private String nombre;

    private String descripcion;

    private Double precio;

    private String talle;

    private Integer stock;

    private Integer stockReservado;

    private EstadoProducto estado;

    private Long categoryId;

    private Long vendedorId;
}