package com.uade.EcommerceUniformes.marketplace.entity;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder

public class Calificacion {
    private Producto producto;
    private int calificacionTotal;
    private List<Comentario> comentarios;

}
