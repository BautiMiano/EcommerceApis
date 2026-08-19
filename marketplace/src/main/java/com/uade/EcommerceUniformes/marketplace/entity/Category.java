package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Category {

    public Category(String nombre) {
        this.nombre = nombre;
    }

    public Category() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nombre;


}
