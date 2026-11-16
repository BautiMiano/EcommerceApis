package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Si el usuario logueado puede reseñar un producto y, si no puede, por qué. */
@Data
@AllArgsConstructor
public class PermisoComentarioResponse {
    private boolean puedeComentar;
    private String motivo;
}
