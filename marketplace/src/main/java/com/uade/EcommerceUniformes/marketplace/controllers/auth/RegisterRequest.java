package com.uade.EcommerceUniformes.marketplace.controllers.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String mail;
    private String contrasena;
}