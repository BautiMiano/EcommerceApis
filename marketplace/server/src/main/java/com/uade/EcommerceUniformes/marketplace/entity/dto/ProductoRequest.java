package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

import lombok.Data;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductoRequest {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("nombre")
    private String nombre;

    @JsonProperty("descripcion")
    private String descripcion;

    @JsonProperty("precio")
    private Double precio;

    // Talles que ofrece el producto, cada uno con su stock
    @JsonProperty("talles")
    private List<TalleStockDto> talles;

    // Solo en las respuestas: suma del stock de todos los talles
    @JsonProperty("stock")
    private Integer stock;

    // Solo en PATCH /productos/stock: el talle al que se le suma stock
    @JsonProperty("talle")
    private Talle talle;

    @JsonProperty("estado")
    private EstadoProducto estado;

    @JsonProperty("activo")
    private Boolean activo;

    @JsonProperty("categoryId")
    private Long categoryId;

    @JsonProperty("vendedorId")
    private Long vendedorId;

    @JsonProperty("descuentoId")
    private Long descuentoId;


    @JsonProperty("imagenes")
    private List<String> imagenes;
}