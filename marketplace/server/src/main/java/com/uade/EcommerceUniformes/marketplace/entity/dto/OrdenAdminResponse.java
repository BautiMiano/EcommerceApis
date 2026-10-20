package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Una orden vista por el admin: datos del comprador y los ítems, sin el usuario completo. */
@Data
@AllArgsConstructor
public class OrdenAdminResponse {

    private Long id;
    private Date fechaCompra;
    private String estado;
    private String metodoDePago;
    private String comprador;
    private String compradorMail;
    private int cantidadProductos;
    private double total;
    private List<ItemVentaResponse> items;

    public static OrdenAdminResponse desde(OrdenDeCompra orden) {
        String nombre = Objects.toString(orden.getUsuario().getNombre(), "");
        String apellido = Objects.toString(orden.getUsuario().getApellido(), "");
        List<ItemDeOrdenDeCompra> itemsOrden = orden.getItems() != null ? orden.getItems() : List.of();

        List<ItemVentaResponse> items = itemsOrden.stream()
                .map(item -> new ItemVentaResponse(
                        item.getProducto().getId(),
                        item.getProducto().getNombre(),
                        item.getTalle() != null ? item.getTalle().name() : null,
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getCantidad() * item.getPrecioUnitario()))
                .toList();

        int cantidadProductos = itemsOrden.stream()
                .mapToInt(ItemDeOrdenDeCompra::getCantidad)
                .sum();

        return new OrdenAdminResponse(
                orden.getId(),
                orden.getFechaCompra(),
                orden.getEstado() != null ? orden.getEstado().name() : null,
                orden.getMetodoDePago() != null ? orden.getMetodoDePago().name() : null,
                (nombre + " " + apellido).trim(),
                orden.getUsuario().getMail(),
                cantidadProductos,
                orden.getTotal() != null ? orden.getTotal() : 0,
                items);
    }
}