package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.Category;

/**
 * Consultas de categorías para el chatbot, separadas del repositorio del grupo.
 */
public interface CategoriaChatRepository extends JpaRepository<Category, Long> {

    List<Category> findByActivoTrueOrderByNombreAsc();
}
