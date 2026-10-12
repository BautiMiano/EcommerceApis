package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;

/**
 * Lo que el bot ve de las ventas del vendedor. No incluye datos de los compradores.
 */
public record VentasResultado(
        String fechaDeHoy,
        int cantidadDeVentas,
        int unidadesVendidas,
        double totalFacturado,
        Map<String, Double> totalPorMes,
        List<ProductoVendido> masVendidos,
        List<Venta> ultimasVentas) {

    public record ProductoVendido(String producto, String talle, int unidades, double total) {
    }

    public record Venta(Long ordenId, String fecha, String estado, String producto,
                        String talle, int cantidad, double precioUnitario, double subtotal) {
    }
}