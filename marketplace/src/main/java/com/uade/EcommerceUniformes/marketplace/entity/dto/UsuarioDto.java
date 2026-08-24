package com.uade.EcommerceUniformes.marketplace.entity.dto;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
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


    public UsuarioDto(String nombreUsuarioDto,
                      String nombreDto,
                      String apellidoDto,
                      String mailDto,
                      String contrasenaDto,
                      Rol rolUsuarioDto) {

        this.nombreUsuarioDto = nombreUsuarioDto;
        this.nombreDto = nombreDto;
        this.apellidoDto = apellidoDto;
        this.mailDto = mailDto;
        this.contrasenaDto = contrasenaDto;
        this.rolUsuarioDto = rolUsuarioDto;
    }

    public UsuarioDto() {
    }
}