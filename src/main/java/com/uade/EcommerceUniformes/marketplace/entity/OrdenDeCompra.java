package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;
import java.util.List;


@Data
@Entity
public class OrdenDeCompra {
    public OrdenDeCompra(Usuario usuarioComprador, Date fechaCompra, List<Producto> productos, float total, EstadoOrden estado, String comprobante) {
//        this.usuarioComprador = usuarioComprador;
//        this.fechaCompra = fechaCompra;
//        this.productos = productos;
        this.total = total;
//        this.estado = estado;
//        this.comprobante = comprobante;
    }

    public OrdenDeCompra() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    private Usuario usuarioComprador;
//    private Date fechaCompra;
//    private List<Producto> productos;
    @Column
    private Float total;

    @ManyToOne()
    @JoinColumn (name = "usuarioId",nullable = false)
    private Usuario usuario;


//    private EstadoOrden estado;
//    private String comprobante;
}
