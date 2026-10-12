package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoChatRepository;
import com.uade.EcommerceUniformes.marketplace.service.chat.RolChat;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerMisProductosTool implements ChatTool {

    private static final int MAX_RESULTADOS = 30;

    private final ProductoChatRepository productoChatRepository;

    @Override
    public String nombre() {
        return "verMisProductos";
    }

    @Override
    public Set<RolChat> roles() {
        return Set.of(RolChat.VENDEDOR);
    }

    @Override
    public Map<String, Object> declaracion() {
        // Sin parámetros a propósito: siempre son los productos del vendedor logueado
        return Map.of(
                "name", nombre(),
                "description", "Devuelve los productos publicados por el vendedor logueado, activos e "
                        + "inactivos, con precio, talle, stock, stock reservado y stock disponible. "
                        + "Usala cuando pregunte por sus publicaciones, productos o stock.");
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        List<Producto> todos = productoChatRepository.findByVendedorIdOrderByNombreAsc(usuario.getId());

        List<MiProductoResultado> productos = todos.stream()
                .limit(MAX_RESULTADOS)
                .map(this::aResultado)
                .toList();

        long activos = todos.stream().filter(Producto::isActivo).count();

        return Map.of(
                "total", todos.size(),
                "activos", activos,
                "inactivos", todos.size() - activos,
                "mostrados", productos.size(),
                "productos", productos);
    }

    private MiProductoResultado aResultado(Producto p) {
        return new MiProductoResultado(
                p.getId(),
                p.getNombre(),
                p.getTalle(),
                p.getCategoria() != null ? p.getCategoria().getNombre() : null,
                p.getEstado() != null ? p.getEstado().name() : null,
                p.getPrecio(),
                p.getStock(),
                p.getStockReservado(),
                p.getStock() - p.getStockReservado(),
                p.isActivo());
    }
}