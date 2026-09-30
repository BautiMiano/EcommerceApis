package com.uade.EcommerceUniformes.marketplace.entity.dto;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;

import lombok.Data;

@Data 
public class CarritoRequest {
    private Long productoId;
    private int cantidad;
    private MetodoDePago metodoDePago;
}
