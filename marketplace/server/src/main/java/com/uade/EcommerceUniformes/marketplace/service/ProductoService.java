package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;

public interface ProductoService {
    List<ProductoRequest> getProductos();

    ProductoRequest getProductoById(Long productoId);

    List<ProductoRequest> getProductosByCategoria(Long categoryId);

    ProductoRequest createProducto(ProductoRequest request);

    ProductoRequest updateProducto(Long productoId, ProductoRequest request);

    void desactivarProducto(Long productoId);

    public void activarProducto(Long productoId);

    public void modificarStock(ProductoRequest request);

    void reservarStock(Long productoId, Talle talle, int cantidad);

    void liberarStock(Long productoId, Talle talle, int cantidad);

    void descontarStockDefinitivo(Long productoId, Talle talle, int cantidad);

    /** Devuelve al stock las unidades de un pedido cancelado. */
    void devolverStock(Long productoId, Talle talle, int cantidad);

    Optional<Producto> getProductoEntityById(Long productoId);

    /** Arma la respuesta de un producto (con talles, stock total e imágenes) para reutilizarla en otros servicios. */
    ProductoRequest toResponse(Producto producto);

    String getImagenPrincipal(Producto producto);

    List<ProductoRequest> getMisProductos();

    public List<ProductoRequest> getProductosByPrecio(Double precioMin, Double precioMax);

    public List<ProductoRequest> buscarProductosPorNombre(String q);

    public List<ProductoRequest> getProductosByTalle(String talle);

        public List<String> getTallesDisponibles();



}