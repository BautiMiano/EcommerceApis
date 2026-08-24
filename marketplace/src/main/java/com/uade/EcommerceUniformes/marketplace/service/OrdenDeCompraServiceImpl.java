package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.repository.OrdenDeCompraRepository;

@Service
public class OrdenDeCompraServiceImpl implements OrdenDeCompraService {

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    public List<OrdenDeCompra> getOrdenesDeCompra() {
        return ordenDeCompraRepository.findAll();
    }

    public Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId) {
        return ordenDeCompraRepository.findById(ordenId);
    }

    public OrdenDeCompra createOrdenDeCompra(OrdenDeCompra orden) {

        double total = 0;

        for (Producto producto : orden.getProductos()){
            total += producto.getPrecio();
        }
        orden.setTotal(total);
        return ordenDeCompraRepository.save(orden);
    }

    public void deleteOrdenDeCompra(Long ordenId){
        OrdenDeCompra orden = ordenDeCompraRepository.findById(ordenId).orElseThrow(() -> new RuntimeException("Orden de compra no encontrada con id: " + ordenId));
        ordenDeCompraRepository.delete(orden);
    }
}