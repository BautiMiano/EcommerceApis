package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.sql.Date;
import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;

import lombok.Data;
import lombok.AllArgsConstructor;

/**
 * Una orden vista por el vendedor: solo incluye sus propios ítems,
 * y la cantidad y el total se calculan sobre esos ítems.
 */
@Data
@AllArgsConstructor
public class VentaResponse {

    private Long ordenId;
    private Date fechaCompra;
    private EstadoOrden estado;
    private String comprador;
    private int cantidadProductos;
    private double total;
    private List<ItemVentaResponse> items;
}
