package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.OrdenChatRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerMisOrdenesTool implements ChatTool {

    private final OrdenChatRepository ordenChatRepository;

    @Override
    public String nombre() {
        return "verMisOrdenes";
    }

    @Override
    public Map<String, Object> declaracion() {
        // Sin parámetros a propósito: siempre son las órdenes del usuario logueado
        return Map.of(
                "name", nombre(),
                "description", "Devuelve las últimas 5 compras del usuario logueado, con su estado, "
                        + "fecha, total y productos. Usala cuando pregunte por sus pedidos, compras, "
                        + "envíos o el estado de una orden.");
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        List<OrdenResultado> ordenes = ordenChatRepository
                .findTop5ByUsuarioIdOrderByIdDesc(usuario.getId())
                .stream()
                .map(this::aResultado)
                .toList();

        return Map.of("cantidad", ordenes.size(), "ordenes", ordenes);
    }

    private OrdenResultado aResultado(OrdenDeCompra orden) {
        List<OrdenResultado.Item> items = orden.getItems().stream()
                .map(item -> new OrdenResultado.Item(
                        item.getProducto().getNombre(),
                        item.getProducto().getTalle(),
                        item.getCantidad(),
                        item.getPrecioUnitario()))
                .toList();

        return new OrdenResultado(
                orden.getId(),
                orden.getFechaCompra() != null ? orden.getFechaCompra().toString() : null,
                orden.getEstado() != null ? orden.getEstado().name() : null,
                orden.getMetodoDePago() != null ? orden.getMetodoDePago().name() : null,
                orden.getTotal() != null ? orden.getTotal() : 0,
                items);
    }
}