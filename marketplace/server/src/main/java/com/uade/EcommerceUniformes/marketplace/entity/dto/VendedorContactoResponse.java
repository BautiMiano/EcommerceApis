package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Datos para que el comprador se comunique con el vendedor después de comprar. Telefono puede ser null. */
@Data
@AllArgsConstructor
public class VendedorContactoResponse {
    private Long id;
    private String nombre;
    private String nombreUsuario;
    private String mail;
    private String telefono;
}
