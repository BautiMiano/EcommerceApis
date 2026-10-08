package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoChatRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BuscarProductosTool implements ChatTool {

    private static final int MAX_RESULTADOS = 8;
    private static final int MAX_DESCRIPCION = 150;

    private final ProductoChatRepository productoChatRepository;

    @Override
    public String nombre() {
        return "buscarProductos";
    }

    @Override
    public Map<String, Object> declaracion() {
        return Map.of(
                "name", nombre(),
                "description", "Busca productos disponibles (activos y con stock) en el catálogo de UNIFORMA. "
                        + "Usala siempre que el usuario pregunte por productos, precios, talles o disponibilidad. "
                        + "Todos los filtros son opcionales. Devuelve como máximo " + MAX_RESULTADOS + " productos.",
                "parameters", Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "texto", Map.of("type", "string",
                                        "description", "Palabra clave para buscar en nombre o descripción. Ej: chomba, ambo, casual"),
                                "categoria", Map.of("type", "string",
                                        "description", "Nombre de una categoría. Si no sabés cuáles existen, usá antes listarCategorias"),
                                "talle", Map.of("type", "string",
                                        "description", "Talle exacto. Ej: 12, M, L, 42"),
                                "precioMaximo", Map.of("type", "number",
                                        "description", "Precio máximo en pesos"),
                                "estado", Map.of("type", "string",
                                        "enum", List.of("NUEVO", "USADO"),
                                        "description", "Si el producto es nuevo o usado"))));
    }

    @Override
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        String texto = leerTexto(args, "texto");
        String categoria = leerTexto(args, "categoria");
        String talle = leerTexto(args, "talle");
        Double precioMaximo = args.get("precioMaximo") instanceof Number n ? n.doubleValue() : null;
        EstadoProducto estado = leerEstado(leerTexto(args, "estado"));

        List<ProductoResultado> productos = productoChatRepository
                .buscarParaChat(texto, talle, categoria, precioMaximo, estado, PageRequest.of(0, MAX_RESULTADOS))
                .stream()
                .map(this::aResultado)
                .toList();

        return Map.of("cantidad", productos.size(), "productos", productos);
    }

    private ProductoResultado aResultado(Producto p) {
        Double porcentaje = p.getDescuento() != null ? p.getDescuento().getPorcentaje() : null;
        double precioFinal = porcentaje != null
                ? Math.round(p.getPrecio() * (1 - porcentaje / 100))
                : p.getPrecio();

        return new ProductoResultado(
                p.getId(),
                p.getNombre(),
                recortar(p.getDescripcion()),
                p.getTalle(),
                p.getCategoria() != null ? p.getCategoria().getNombre() : null,
                p.getEstado() != null ? p.getEstado().name() : null,
                p.getPrecio(),
                precioFinal,
                porcentaje,
                p.getStock() - p.getStockReservado());
    }

    private String leerTexto(Map<String, Object> args, String clave) {
        return args.get(clave) instanceof String s && !s.isBlank() ? s.trim() : null;
    }

    private EstadoProducto leerEstado(String valor) {
        if (valor == null) {
            return null;
        }
        try {
            return EstadoProducto.valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // si el modelo manda algo raro, se ignora el filtro
        }
    }

    private String recortar(String texto) {
        if (texto == null || texto.length() <= MAX_DESCRIPCION) {
            return texto;
        }
        return texto.substring(0, MAX_DESCRIPCION) + "...";
    }
}