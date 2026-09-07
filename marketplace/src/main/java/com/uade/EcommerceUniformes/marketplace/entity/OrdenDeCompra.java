package com.uade.EcommerceUniformes.marketplace.entity;

import java.sql.Date;
import java.util.List;

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
import lombok.Data;
@Data
@Entity
public class OrdenDeCompra {

    public OrdenDeCompra(Usuario usuario, Date fechaCompra,
            List<ItemDeOrdenDeCompra> items, Double total, MetodoDePago metodoDePago,
            EstadoOrden estado, String comprobante) {

        this.usuario = usuario;
        this.fechaCompra = fechaCompra;
        this.items = items;
        this.total = total;
        this.metodoDePago = metodoDePago;
        this.estado = estado;
        this.comprobante = comprobante;
    }

    public OrdenDeCompra() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Date fechaCompra;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemDeOrdenDeCompra> items;

    @Column(nullable = false)
    private Double total;

    @ManyToOne
    @JoinColumn(name = "usuarioId", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoDePago metodoDePago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado;

    @Column
    private String comprobante;
}
