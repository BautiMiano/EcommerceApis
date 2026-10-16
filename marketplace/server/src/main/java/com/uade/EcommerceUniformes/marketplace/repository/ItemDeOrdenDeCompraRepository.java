package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;

public interface ItemDeOrdenDeCompraRepository extends JpaRepository<ItemDeOrdenDeCompra, Long> {
    List<ItemDeOrdenDeCompra> findByOrdenId(Long ordenId);
    Optional<ItemDeOrdenDeCompra> findByOrdenIdAndProductoId(Long ordenId, Long productoId);
    boolean existsByOrden_Usuario_IdAndProducto_IdAndOrden_Estado(Long usuarioId, Long productoId, EstadoOrden estado);
}