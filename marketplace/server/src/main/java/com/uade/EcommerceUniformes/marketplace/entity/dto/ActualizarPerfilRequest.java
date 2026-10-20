package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.Data;

@Data
public class ActualizarPerfilRequest {
    private String nombre;
    private String apellido;
    private String mail;
    // Opcionales: si no vienen (por ejemplo, desde el perfil del vendedor) no se modifican
    private String nombreUsuario;
    private String telefono;
}
