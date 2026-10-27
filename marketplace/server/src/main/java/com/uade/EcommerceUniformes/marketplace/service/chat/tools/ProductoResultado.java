package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;

/**
 * Lo que el bot ve de cada producto: solo lo necesario, no la entidad entera.
 */
public record ProductoResultado(
        Long id,
        String nombre,
        String descripcion,
        String talle,
        String categoria,
        String estado,
        double precio,
        double precioFinal,
        Double descuentoPorcentaje,
        int stockDisponible) {

    private static final int MAX_DESCRIPCION = 150;

    /** Arma el resultado a partir de un producto. Lo usan buscarProductos y verMisFavoritos. */
    public static ProductoResultado desde(Producto p) {
        Double porcentaje = p.getDescuento() != null ? p.getDescuento().getPorcentaje() : null;
        double precioFinal = porcentaje != null
                ? Math.round(p.getPrecio() * (1 - porcentaje / 100))
                : p.getPrecio();

        return new ProductoResultado(
                p.getId(),
                p.getNombre(),
                recortar(p.getDescripcion()),
                p.getTallesTexto(),
                p.getCategoria() != null ? p.getCategoria().getNombre() : null,
                p.getEstado() != null ? p.getEstado().name() : null,
                p.getPrecio(),
                precioFinal,
                porcentaje,
                p.getStockDisponible());
    }

    private static String recortar(String texto) {
        if (texto == null || texto.length() <= MAX_DESCRIPCION) {
            return texto;
        }
        return texto.substring(0, MAX_DESCRIPCION) + "...";
    }
}