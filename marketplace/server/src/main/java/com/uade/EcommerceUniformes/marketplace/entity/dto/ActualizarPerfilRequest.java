package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.Data;

@Data
public class ActualizarPerfilRequest {
    private String nombre;
    private String apellido;
    private String mail;
}
