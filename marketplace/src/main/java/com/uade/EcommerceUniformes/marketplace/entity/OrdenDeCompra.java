package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;


@Data
@Entity
public class OrdenDeCompra {
//     public OrdenDeCompra(Usuario usuarioComprador, Date fechaCompra, List<Producto> productos, float total, EstadoOrden estado, String comprobante) {
// //        this.usuarioComprador = usuarioComprador;
// //        this.fechaCompra = fechaCompra;
// //        this.productos = productos;
//         this.total = total;
// //        this.estado = estado;
// //        this.comprobante = comprobante;
//     }

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
