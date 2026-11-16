package com.uade.EcommerceUniformes.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Datos de envío que el comprador carga al confirmar la compra.
 * Se guardan dentro de cada orden (columnas envio_*), así el vendedor sabe a dónde mandar el pedido.
 */
@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class DatosEnvio {

    @Column(name = "envio_receptor")
    private String nombreReceptor;

    @Column(name = "envio_telefono")
    private String telefono;

    @Column(name = "envio_direccion")
    private String direccion;

    @Column(name = "envio_ciudad")
    private String ciudad;

    @Column(name = "envio_provincia")
    private String provincia;

    @Column(name = "envio_codigo_postal")
    private String codigoPostal;

    @Column(name = "envio_indicaciones")
    private String indicaciones;

    /** Cada orden guarda su propia copia (JPA no permite compartir un embeddable entre entidades). */
    public DatosEnvio copiar() {
        return new DatosEnvio(nombreReceptor, telefono, direccion, ciudad, provincia, codigoPostal, indicaciones);
    }
}
