package com.uade.EcommerceUniformes.marketplace.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoCarrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByUsuarioId(Long usuarioId);

    Optional<Carrito> findByUsuarioIdAndEstado(
            Long usuarioId,
            EstadoCarrito estado
    );

    List<Carrito> findByEstadoAndFechaInicioPagoBefore(
            EstadoCarrito estado,
            LocalDateTime fechaInicioPago
    );
}
