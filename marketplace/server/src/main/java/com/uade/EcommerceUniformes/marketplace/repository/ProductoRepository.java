package com.uade.EcommerceUniformes.marketplace.repository;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByVendedorId(Long vendedorId);

    List<Producto> findByPrecioBetween(Double min, Double max);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByTalleIgnoreCase(String talle);
    List<Producto> findDistinctByTalleNotNull();
 
    
}