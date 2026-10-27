package com.uade.EcommerceUniformes.marketplace.entity;

public enum MetodoDePago {
    MERCADOPAGO("Mercado Pago"),
    TARJETA("Tarjeta de crédito o débito"),
    TRANSFERENCIA("Transferencia bancaria");

    private final String nombre;

    MetodoDePago(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}