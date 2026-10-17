package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    Optional<ItemCarrito> findByCarritoIdAndProductoId(Long carritoId, Long productoId);
    List<ItemCarrito> findByCarritoId(Long carritoId);
}