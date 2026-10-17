package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsuarioDto {

    @JsonProperty("nombreUsuario")
    private String nombreUsuarioDto;

    @JsonProperty("nombre")
    private String nombreDto;

    @JsonProperty("apellido")
    private String apellidoDto;

    @JsonProperty("mail")
    private String mailDto;

    @JsonProperty("contrasena")
    private String contrasenaDto;

    @JsonProperty("rolUsuario")
    private Rol rolUsuarioDto;

    @JsonProperty("activo")
    private Boolean activoDto;



}