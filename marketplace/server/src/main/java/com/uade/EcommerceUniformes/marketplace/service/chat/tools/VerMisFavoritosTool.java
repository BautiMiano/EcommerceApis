package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.FavoritoRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerMisFavoritosTool implements ChatTool {

    private final FavoritoRepository favoritoRepository;

    @Override
    public String nombre() {
        return "verMisFavoritos";
    }

    @Override
    public Map<String, Object> declaracion() {
        // Sin parámetros a propósito: siempre son los favoritos del usuario logueado
        return Map.of(
                "name", nombre(),
                "description", "Devuelve los productos que el usuario logueado guardó como favoritos, "
                        + "con su precio, descuento, talles y stock. Usala cuando pregunte por sus "
                        + "favoritos o por los productos que guardó.");
    }

    @Override
    @Transactional(readOnly = true)
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        List<ProductoResultado> productos = favoritoRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(favorito -> ProductoResultado.desde(favorito.getProducto()))
                .toList();

        return Map.of("cantidad", productos.size(), "productos", productos);
    }
}