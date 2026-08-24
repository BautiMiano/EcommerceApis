package com.uade.EcommerceUniformes.marketplace.entity;




import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;



@Data
@Entity
public class OrdenDeCompra {
    public OrdenDeCompra(Usuario usuario,Date fechaCompra,float total,EstadoOrden estado,String comprobante) {
    this.usuario = usuario;
    this.fechaCompra = fechaCompra;
    // this.productos = productos;
    this.total = total;
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
    
    // @ManyToMany
    // @JoinTable(
    //     name = "orden_producto",
    //     joinColumns = @JoinColumn(name = "orden_id"),
    //     inverseJoinColumns = @JoinColumn(name = "producto_id"))
    // private List<Producto> productos;


    @Column(nullable = false)
    private Float total;

    @ManyToOne()
    @JoinColumn (name = "usuarioId",nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado;
    
    @Column
    private String comprobante;
}
