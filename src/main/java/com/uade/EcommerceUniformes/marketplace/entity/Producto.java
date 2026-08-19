package com.uade.EcommerceUniformes.marketplace.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class Producto {

    @Id
    private int id;

    @Column
    private String nombre;

    @Column
    private String descripcion;

    @Column
    private double precio;

    @Column
    private String talle;

    @Column
    private EstadoProducto estado;

    @Column
    private Category categoria;

    @Column
    private Descuento descuentoProducto;

    @Column
    private int stock;

    @Column
    private String imagen;


}
