package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
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

    @JsonProperty("talle")
    private String talle;

    @JsonProperty("stock")
    private Integer stock;

    @JsonProperty("stockReservado")
    private Integer stockReservado;

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