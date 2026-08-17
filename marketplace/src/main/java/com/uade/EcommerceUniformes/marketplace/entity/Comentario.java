package com.uade.EcommerceUniformes.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class Comentario {
    private Usuario usuarioComentario;
    private int calificacion;
    private String comentarioProducto;
}
