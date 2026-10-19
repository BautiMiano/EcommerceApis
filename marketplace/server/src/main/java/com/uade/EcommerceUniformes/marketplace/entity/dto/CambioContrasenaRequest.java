package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.Data;

@Data
public class CambioContrasenaRequest {
    private String contrasenaActual;
    private String contrasenaNueva;
}
