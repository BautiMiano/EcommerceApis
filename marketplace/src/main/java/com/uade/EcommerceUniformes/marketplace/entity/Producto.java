package com.uade.EcommerceUniformes.marketplace.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

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
    private String talle;
    private int stock;
    private String imagen;
    @Enumerated(EnumType.STRING)
    private EstadoProducto estado;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Category categoria;
    //private Descuento descuentoProducto;
    

}
