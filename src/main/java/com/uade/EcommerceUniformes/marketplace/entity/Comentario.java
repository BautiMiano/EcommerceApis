package com.uade.EcommerceUniformes.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class Comentario {
    private Producto producto;
    private Usuario usuarioComentario;
    private String comentarioProducto;
}
