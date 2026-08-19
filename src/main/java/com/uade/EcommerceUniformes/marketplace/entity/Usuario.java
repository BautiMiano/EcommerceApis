package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;


@Data
@Entity
public class Usuario {



    public Usuario() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column
    (nullable = false)    private String nombreUsuario;

    @Column(nullable = false)
    private String nombre;

    @Column
    private String apellido;

    @Column(nullable = false)
    private String mail;

    @Column(nullable = false)
    private String contrasena;

    @OneToMany(mappedBy = "usuario" )
    private List<OrdenDeCompra> ordenDeCompras;

   @Enumerated(EnumType.STRING)
   @Column(nullable = false)
   private Rol rolUsuario;

}
