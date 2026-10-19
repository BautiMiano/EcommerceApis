package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.uade.EcommerceUniformes.marketplace.entity.StockTalle;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;

public interface StockTalleRepository extends JpaRepository<StockTalle, Long> {

    @Query("SELECT DISTINCT s.talle FROM StockTalle s")
    List<Talle> findTallesEnUso();
}
