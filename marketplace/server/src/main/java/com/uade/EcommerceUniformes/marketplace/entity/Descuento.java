package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
public class Descuento {
    public Descuento() {
    }
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long idDescuento;
    @Column
    private double porcentaje;
}
