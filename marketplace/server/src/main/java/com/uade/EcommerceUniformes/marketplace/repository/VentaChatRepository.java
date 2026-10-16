package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;

/**
 * Ventas para el chatbot del vendedor: los ítems de órdenes cuyos productos son suyos.
 */
public interface VentaChatRepository extends JpaRepository<ItemDeOrdenDeCompra, Long> {

    List<ItemDeOrdenDeCompra> findByProductoVendedorIdOrderByOrdenIdDesc(Long vendedorId);
}