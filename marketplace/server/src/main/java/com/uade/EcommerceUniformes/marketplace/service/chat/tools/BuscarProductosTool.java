package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoChatRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BuscarProductosTool implements ChatTool {

    private static final int MAX_RESULTADOS = 8;

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
                                        "enum", List.of("S", "M", "L", "XL", "XXL", "UNICO"),
                                        "description", "Talle con stock disponible. UNICO es para productos sin talle"),
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
        Talle talle = leerTalle(leerTexto(args, "talle"));
        Double precioMaximo = args.get("precioMaximo") instanceof Number n ? n.doubleValue() : null;
        EstadoProducto estado = leerEstado(leerTexto(args, "estado"));

        List<ProductoResultado> productos = productoChatRepository
                .buscarParaChat(texto, talle, categoria, precioMaximo, estado, PageRequest.of(0, MAX_RESULTADOS))
                .stream()
                .map(ProductoResultado::desde)
                .toList();

        return Map.of("cantidad", productos.size(), "productos", productos);
    }

   

    private Talle leerTalle(String valor) {
        if (valor == null) {
            return null;
        }
        try {
            return Talle.valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // si el modelo manda algo raro, se ignora el filtro
        }
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

}