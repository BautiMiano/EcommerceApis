package com.uade.EcommerceUniformes.marketplace.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;


@Data
@Entity
public class Usuario {


    public Usuario(String nombreUsuario, String nombre, String apellido, String mail, String contrasena, Rol rolUsuario) {
        this.nombreUsuario = nombreUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.contrasena = contrasena;
        this.rolUsuario = rolUsuario;
    }
    
    public Usuario() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)    
    private String nombreUsuario;

    @Column(nullable = false)
    private String nombre;

    @Column
    private String apellido;

    @Column(nullable = false)
    private String mail;

    @JsonIgnore
    @Column(nullable = false)
    private String contrasena;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario" )
    private List<OrdenDeCompra> ordenDeCompras;

   @Enumerated(EnumType.STRING)
   @Column
   private Rol rolUsuario;


}
