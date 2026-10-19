package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class PerfilResponse {

    private Long id;
    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String mail;
    private Rol rol;
}
