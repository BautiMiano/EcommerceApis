package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoChatRepository;

import lombok.RequiredArgsConstructor;

/** Gemini elige qué productos mostrar como tarjetas, según lo que pidió el usuario. */
@Component
@RequiredArgsConstructor
public class MostrarProductosTool implements ChatTool {

    private static final int MAX_TARJETAS = 8;

    private final ProductoChatRepository productoChatRepository;

    @Override
    public String nombre() {
        return "mostrarProductos";
    }

    @Override
    public Map<String, Object> declaracion() {
        return Map.of(
                "name", nombre(),
                "description", "Muestra al usuario, como tarjetas debajo de tu respuesta, los productos que elijas. "
                        + "Pasale solo los ids de los productos que respondan a lo que pidió: uno solo si pidió "
                        + "uno (por ejemplo, el más barato), o varios si pidió opciones. Usala después de buscar.",
                "parameters", Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "ids", Map.of(
                                        "type", "array",
                                        "items", Map.of("type", "integer"),
                                        "description", "Ids de los productos a mostrar, en el orden en que querés mostrarlos")),
                        "required", List.of("ids")));
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        List<Long> ids = args.get("ids") instanceof List<?> lista
                ? lista.stream()
                        .filter(Number.class::isInstance)
                        .map(n -> ((Number) n).longValue())
                        .distinct()
                        .limit(MAX_TARJETAS)
                        .toList()
                : List.of();

        // Solo productos activos, en el orden que eligió Gemini
        Map<Long, Producto> porId = productoChatRepository.findAllById(ids).stream()
                .filter(Producto::isActivo)
                .collect(Collectors.toMap(Producto::getId, p -> p));

        List<ProductoResultado> tarjetas = ids.stream()
                .map(porId::get)
                .filter(Objects::nonNull)
                .map(ProductoResultado::desde)
                .toList();

        return Map.of("mostrados", tarjetas.size(), "tarjetas", tarjetas);
    }
}