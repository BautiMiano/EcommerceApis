package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.sql.Date;
import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;
import lombok.Data;

@Data
public class OrdenDeCompraRequest {

    private Long usuarioId;

    private Date fechaCompra;

    private List<Long> productosIds;

    private EstadoOrden estado;

    private String comprobante;

    private MetodoDePago metodoDePago;
}