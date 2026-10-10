package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.VentaChatRepository;
import com.uade.EcommerceUniformes.marketplace.service.chat.RolChat;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerMisVentasTool implements ChatTool {

    private static final Set<String> ESTADOS_VENDIDOS = Set.of("CONFIRMADA", "ENVIADA", "ENTREGADA");
    private static final int MAX_MAS_VENDIDOS = 5;
    private static final int MAX_ULTIMAS = 10;

    private final VentaChatRepository ventaChatRepository;

    @Override
    public String nombre() {
        return "verMisVentas";
    }

    @Override
    public Set<RolChat> roles() {
        return Set.of(RolChat.VENDEDOR);
    }

    @Override
    public Map<String, Object> declaracion() {
        // Sin parámetros a propósito: siempre son las ventas del vendedor logueado
        return Map.of(
                "name", nombre(),
                "description", "Devuelve las ventas concretadas del vendedor logueado: total facturado, "
                        + "unidades vendidas, total por mes, productos más vendidos, últimas ventas "
                        + "y la fecha de hoy. Usala cuando pregunte cuánto vendió, qué vende más "
                        + "o cómo le va en un período.");
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        // Solo los ítems de órdenes concretadas (sin pendientes ni canceladas)
        List<ItemDeOrdenDeCompra> items = ventaChatRepository
                .findByProductoVendedorIdOrderByOrdenIdDesc(usuario.getId())
                .stream()
                .filter(i -> i.getOrden().getEstado() != null
                        && ESTADOS_VENDIDOS.contains(i.getOrden().getEstado().name()))
                .toList();

        int cantidadDeVentas = (int) items.stream().map(i -> i.getOrden().getId()).distinct().count();
        int unidades = items.stream().mapToInt(ItemDeOrdenDeCompra::getCantidad).sum();
        double total = items.stream().mapToDouble(this::subtotal).sum();

        // TreeMap ordena los meses: 2026-09, 2026-10...
        Map<String, Double> totalPorMes = items.stream()
                .collect(Collectors.groupingBy(
                        i -> mes(i.getOrden().getFechaCompra()),
                        TreeMap::new,
                        Collectors.summingDouble(this::subtotal)));

        List<VentasResultado.ProductoVendido> masVendidos = items.stream()
                .collect(Collectors.groupingBy(i -> i.getProducto().getId()))
                .values().stream()
                .map(delMismoProducto -> new VentasResultado.ProductoVendido(
                        delMismoProducto.get(0).getProducto().getNombre(),
                        delMismoProducto.get(0).getProducto().getTalle(),
                        delMismoProducto.stream().mapToInt(ItemDeOrdenDeCompra::getCantidad).sum(),
                        delMismoProducto.stream().mapToDouble(this::subtotal).sum()))
                .sorted(Comparator.comparingInt(VentasResultado.ProductoVendido::unidades).reversed())
                .limit(MAX_MAS_VENDIDOS)
                .toList();

        List<VentasResultado.Venta> ultimas = items.stream()
                .limit(MAX_ULTIMAS)
                .map(i -> new VentasResultado.Venta(
                        i.getOrden().getId(),
                        String.valueOf(i.getOrden().getFechaCompra()),
                        i.getOrden().getEstado().name(),
                        i.getProducto().getNombre(),
                        i.getProducto().getTalle(),
                        i.getCantidad(),
                        i.getPrecioUnitario(),
                        subtotal(i)))
                .toList();

        return new VentasResultado(LocalDate.now().toString(), cantidadDeVentas, unidades, total,
                totalPorMes, masVendidos, ultimas);
    }

    private double subtotal(ItemDeOrdenDeCompra item) {
        return item.getCantidad() * item.getPrecioUnitario();
    }

    /** Convierte la fecha de la orden a "año-mes", sea LocalDate o Date. */
    private String mes(Object fecha) {
        if (fecha instanceof LocalDate f) {
            return YearMonth.from(f).toString();
        }
        if (fecha instanceof java.util.Date d) {
            return YearMonth.from(new java.sql.Date(d.getTime()).toLocalDate()).toString();
        }
        return "sin fecha";
    }
}