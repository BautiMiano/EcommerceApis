package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.CategoriaChatRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ListarCategoriasTool implements ChatTool {

    private final CategoriaChatRepository categoriaChatRepository;

    @Override
    public String nombre() {
        return "listarCategorias";
    }

    @Override
    public Map<String, Object> declaracion() {
        return Map.of(
                "name", nombre(),
                "description", "Devuelve las categorías de productos disponibles en UNIFORMA. "
                        + "Usala cuando el usuario pregunte qué tipos de uniformes hay, "
                        + "o para saber qué categorías existen antes de buscar productos.");
    }

    @Override
    public Object ejecutar(Map<String, Object> args, Usuario usuario) {
        List<String> categorias = categoriaChatRepository.findByActivoTrueOrderByNombreAsc()
                .stream()
                .map(Category::getNombre)
                .toList();

        return Map.of("cantidad", categorias.size(), "categorias", categorias);
    }
}