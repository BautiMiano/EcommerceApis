package com.uade.EcommerceUniformes.marketplace.entity.dto;
import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;

import lombok.Data;

@Data
public class OrdenDeCompraRequest {
    private Long usuarioId;

    private List<Long> productosIds;

    private String comprobante;

    private MetodoDePago metodoDePago;
}