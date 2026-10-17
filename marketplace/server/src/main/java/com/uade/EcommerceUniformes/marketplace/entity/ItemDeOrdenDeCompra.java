package com.uade.EcommerceUniformes.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "items_orden_compra")
public class ItemDeOrdenDeCompra {

    public ItemDeOrdenDeCompra(OrdenDeCompra orden, Producto producto, int cantidad, double precioUnitario) {
        this.orden = orden;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public ItemDeOrdenDeCompra() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ordenId", nullable = false)
    @JsonIgnore 
    private OrdenDeCompra orden;

    @ManyToOne
    @JoinColumn(name = "productoId", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false)
    private double precioUnitario;
}
