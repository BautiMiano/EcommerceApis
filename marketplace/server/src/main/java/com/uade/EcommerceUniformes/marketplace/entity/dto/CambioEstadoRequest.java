package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;

import lombok.Data;

@Data
public class CambioEstadoRequest {
    private EstadoOrden estado;
}
