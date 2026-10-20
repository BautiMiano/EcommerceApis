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

    @JsonProperty("sku")
    private String sku;

    @JsonProperty("marca")
    private String marca;

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

    // Solo en las respuestas: datos para mostrar sin pedir la categoría, el
    // vendedor o el descuento aparte
    @JsonProperty("categoria")
    private String categoria;

    @JsonProperty("vendedor")
    private String vendedor;

    @JsonProperty("descuentoPorcentaje")
    private Double descuentoPorcentaje;

    // Si lo aplicó un admin, el vendedor no lo puede cambiar
    @JsonProperty("descuentoAplicadoPorAdmin")
    private Boolean descuentoAplicadoPorAdmin;

    @JsonProperty("imagenes")
    private List<String> imagenes;

    // Ids de las imágenes activas, en el mismo orden que "imagenes" (para poder
    // desactivarlas)
    @JsonProperty("imagenIds")
    private List<Long> imagenIds;

    @JsonProperty("estadoStock")
    private String estadoStock;

    @JsonProperty("tallesTexto")
    private String tallesTexto;

    // Solo en las respuestas: stock total menos reservado
    @JsonProperty("stockDisponible")
    private Integer stockDisponible;

    // Solo en las respuestas: "agotado", "pocas" o "disponible"
    @JsonProperty("nivelStock")
    private String nivelStock;

    // Solo en las respuestas: texto listo para mostrar
    @JsonProperty("mensajeStock")
    private String mensajeStock;

    @JsonProperty("estadoPublicacion")
    private String estadoPublicacion;

    @JsonProperty("tonoPublicacion")
    private String tonoPublicacion;

    // Solo si el producto tiene un único talle
    @JsonProperty("talleUnico")
    private Talle talleUnico;

}