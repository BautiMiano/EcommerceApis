package com.uade.EcommerceUniformes.marketplace.entity;

import lombok.Builder;
import lombok.Data;

import java.sql.Date;
import java.util.List;


@Data
@Builder
public class OrdenDeCompra {
    private int id;
    private Usuario usuarioComprador;
    private Date fechaCompra;
    private List<Producto> productos;
    private double total;
    private EstadoOrden estado;
    private String comprobante;
}
