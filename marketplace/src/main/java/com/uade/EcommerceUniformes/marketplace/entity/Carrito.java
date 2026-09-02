package com.uade.EcommerceUniformes.marketplace.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Carrito {
    public Carrito() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrito> items;
}