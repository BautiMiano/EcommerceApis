package com.uade.EcommerceUniformes.marketplace.repository;


import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenDeCompraRepository extends JpaRepository<OrdenDeCompra, Long> {
}
