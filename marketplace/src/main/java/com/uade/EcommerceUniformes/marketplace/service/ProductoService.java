package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;

public interface ProductoService {

    List<Producto> getProductos();

    Optional<Producto> getProductoById(Long productoId);

    List<Producto> getProductosByCategoria(Long categoryId);

    Producto createProducto(ProductoRequest request);

    void deleteProducto(Long productoId);
}