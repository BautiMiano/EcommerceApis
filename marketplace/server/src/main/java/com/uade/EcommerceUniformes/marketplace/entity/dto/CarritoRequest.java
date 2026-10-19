package com.uade.EcommerceUniformes.marketplace.entity.dto;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;

import lombok.Data;

@Data
public class CarritoRequest {
    private Long productoId;
    private Talle talle;
    private int cantidad;
    private MetodoDePago metodoDePago;
}
