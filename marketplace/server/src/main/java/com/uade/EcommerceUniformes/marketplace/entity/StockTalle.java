package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/** Stock de un producto en un talle puntual. */
@Data
@NoArgsConstructor
@Entity
@Table(name = "producto_talles",
        uniqueConstraints = @UniqueConstraint(columnNames = {"producto_id", "talle"}))
public class StockTalle {

    public StockTalle(Producto producto, Talle talle, int stock) {
        this.producto = producto;
        this.talle = talle;
        this.stock = stock;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Producto producto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Talle talle;

    private int stock;

    private int stockReservado;

    public int getStockDisponible() {
        return stock - stockReservado;
    }
}
