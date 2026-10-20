package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioResponse {
    private Long id;
    private String comentarioProducto;
    private int calificacion;
    private String usuarioNombre;
}