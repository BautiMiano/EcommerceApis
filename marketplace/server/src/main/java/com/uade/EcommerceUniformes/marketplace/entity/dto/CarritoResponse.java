package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CarritoResponse {

    private Long id;
    private String estado;
    private Long usuarioId;
    private List<ItemCarritoResponse> items;
    private double total;
}