package com.uade.EcommerceUniformes.marketplace.entity;

import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class Usuario {
    private int id;
    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String mail;
    private String contrasena;
    private Rol rolUsuario;

}
