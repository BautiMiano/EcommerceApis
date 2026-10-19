package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoProducto;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;

/**
 * Búsqueda de productos para el chatbot.
 * Está separada de ProductoRepository para no modificar código del grupo.
 */
public interface ProductoChatRepository extends JpaRepository<Producto, Long> {

    @Query("""
            SELECT p FROM Producto p
            WHERE p.activo = true
              AND EXISTS (SELECT s FROM StockTalle s
                          WHERE s.producto = p
                            AND (s.stock - s.stockReservado) > 0
                            AND (:talle IS NULL OR s.talle = :talle))
              AND (:texto IS NULL
                   OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
                   OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :texto, '%')))
              AND (:categoria IS NULL OR LOWER(p.categoria.nombre) = LOWER(:categoria))
              AND (:precioMaximo IS NULL OR p.precio <= :precioMaximo)
              AND (:estado IS NULL OR p.estado = :estado)
            ORDER BY p.precio ASC
            """)
        List<Producto> buscarParaChat(
            @Param("texto") String texto,
            @Param("talle") Talle talle,
            @Param("categoria") String categoria,
            @Param("precioMaximo") Double precioMaximo,
            @Param("estado") EstadoProducto estado,
            Pageable pageable);

        List<Producto> findByVendedorIdOrderByNombreAsc(Long vendedorId);
}