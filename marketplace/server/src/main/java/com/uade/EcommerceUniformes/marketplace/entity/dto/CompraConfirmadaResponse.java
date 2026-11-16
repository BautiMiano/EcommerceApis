package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Respuesta de POST /carritos/{id}/confirmar: el carrito (ya vacío) y las órdenes creadas con su vendedor. */
@Data
@AllArgsConstructor
public class CompraConfirmadaResponse {
    private CarritoResponse carrito;
    private List<OrdenConfirmadaResponse> ordenes;
}
