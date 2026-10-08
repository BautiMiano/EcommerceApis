package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;

public interface ProductoService {
    List<ProductoRequest> getProductos();
    ProductoRequest getProductoById(Long productoId);
    List<ProductoRequest> getProductosByCategoria(Long categoryId);
    ProductoRequest createProducto(ProductoRequest request);
    void desactivarProducto(Long productoId);
    public void activarProducto(Long productoId);
    public void modificarStock(ProductoRequest request);
    void reservarStock(Long productoId, int cantidad);
    void liberarStock(Long productoId, int cantidad);
    void descontarStockDefinitivo(Long productoId, int cantidad);
    Optional<Producto> getProductoEntityById(Long productoId);
    List<ProductoRequest> getMisProductos();

}