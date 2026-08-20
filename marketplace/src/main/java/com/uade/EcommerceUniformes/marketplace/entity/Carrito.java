package com.uade.EcommerceUniformes.marketplace.entity;


import lombok.Builder;
import lombok.Data;

import java.util.List;

import jakarta.persistence.Entity;

@Data
@Entity
public class Carrito {
    private int id;
    private Usuario usuario;
    private List<Producto> productos;

}
