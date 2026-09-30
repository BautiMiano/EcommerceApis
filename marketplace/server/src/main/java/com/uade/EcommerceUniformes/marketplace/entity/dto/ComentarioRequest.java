package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.Data;

@Data
public class ComentarioRequest {
    private Long usuarioId;
    private String comentarioProducto;
    private int calificacion;
    private Long productoId;
    
}
