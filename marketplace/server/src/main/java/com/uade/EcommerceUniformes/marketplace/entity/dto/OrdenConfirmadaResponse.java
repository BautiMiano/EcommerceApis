package com.uade.EcommerceUniformes.marketplace.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Una orden creada al confirmar la compra (hay una por vendedor). */
@Data
@AllArgsConstructor
public class OrdenConfirmadaResponse {
    private Long ordenId;
    private int cantidadProductos;
    private double total;
    private VendedorContactoResponse vendedor;
}
