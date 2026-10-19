package com.uade.EcommerceUniformes.marketplace.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String nombre;
    private String descripcion;
    private double precio;
    private String sku;
    private String marca;

    // Stock propio de cada talle que ofrece el producto
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<StockTalle> talles = new ArrayList<>();

    @Builder.Default
    private boolean activo = true;
    private boolean desactivadoPorCategoria;

    @Enumerated(EnumType.STRING)
    private EstadoProducto estado;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Category categoria;

    @ManyToOne
    @JoinColumn(name = "descuento_id")
    private Descuento descuento;
    private boolean descuentoAplicadoPorAdmin;

    @OneToMany(mappedBy = "producto")
    private List<Imagen> imagenes;

    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Usuario vendedor;

    public Optional<StockTalle> buscarTalle(Talle talle) {
        return talles.stream().filter(t -> t.getTalle() == talle).findFirst();
    }

    public int getStockTotal() {
        return talles.stream().mapToInt(StockTalle::getStock).sum();
    }

    public int getStockReservadoTotal() {
        return talles.stream().mapToInt(StockTalle::getStockReservado).sum();
    }

    public int getStockDisponible() {
        return talles.stream().mapToInt(StockTalle::getStockDisponible).sum();
    }

    /** Talles ofrecidos en texto, ej: "S, M, L". */
    public String getTallesTexto() {
        return talles.stream().map(t -> t.getTalle().name()).collect(Collectors.joining(", "));
    }
}