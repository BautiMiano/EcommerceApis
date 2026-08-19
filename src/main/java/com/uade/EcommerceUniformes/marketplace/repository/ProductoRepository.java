package com.uade.EcommerceUniformes.marketplace.repository;


import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto,Long> {
}
