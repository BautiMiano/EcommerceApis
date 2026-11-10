package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.LinkedHashMap;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoChatRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerMiCarritoTool implements ChatTool {

    private final CarritoChatRepository carritoChatRepository;
    private static final int MAX_TARJETAS = 3;

    @Override
    public String nombre() {
        return "verMiCarrito";
    }

    @Override
    public Map<String, Object> declaracion() {
        // Sin parámetros a propósito: siempre es el carrito del usuario logueado
        return Map.of(
                "name", nombre(),
                "description", "Devuelve el carrito actual del usuario logueado: su estado, "
                        + "los productos que tiene, sus cantidades y el total. Usala cuando pregunte "
                        + "qué tiene en el carrito o cuánto le sale su compra.");
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        return carritoChatRepository.findTopByUsuarioIdOrderByIdDesc(usuario.getId())
                .<Object>map(carrito -> Map.of(
                        "carrito", aResultado(carrito),
                        "tarjetas", tarjetasDe(carrito)))
                .orElse(Map.of("mensaje", "El usuario no tiene ningún carrito"));
    }

    private CarritoResultado aResultado(Carrito carrito) {
        List<CarritoResultado.Item> items = carrito.getItems().stream()
                .map(item -> new CarritoResultado.Item(
                        item.getProducto().getNombre(),
                        item.getTalle() != null ? item.getTalle().name() : null,
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getCantidad() * item.getPrecioUnitario()))
                .toList();

        double total = items.stream().mapToDouble(CarritoResultado.Item::subtotal).sum();
        int cantidad = items.stream().mapToInt(CarritoResultado.Item::cantidad).sum();

        return new CarritoResultado(
                carrito.getId(),
                carrito.getEstado() != null ? carrito.getEstado().name() : null,
                cantidad,
                total,
                items);
    }

    /** Hasta 3 productos del carrito para mostrar como tarjetas (sin repetir si está en dos talles). */
    private List<ProductoResultado> tarjetasDe(Carrito carrito) {
        Map<Long, ProductoResultado> porId = new LinkedHashMap<>();
        for (var item : carrito.getItems()) {
            if (porId.size() == MAX_TARJETAS) {
                break;
            }
            if (!item.getProducto().isActivo()) {
                continue;
            }
            porId.putIfAbsent(item.getProducto().getId(), ProductoResultado.desde(item.getProducto()));
        }
        return new ArrayList<>(porId.values());
    }
}