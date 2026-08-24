package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comentarios")
@Data
@Builder
@NoArgsConstructor  //estos dos los usamos para que spring boot pueda recibir
@AllArgsConstructor // peticiones post y asi no tira error

public class Comentario {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable=false, length=1000)
    private String comentarioProducto;

    private int calificacion;
    
    @ManyToOne
    @JoinColumn(name = "producto_id",nullable = false)
    private Producto producto;
    
}
