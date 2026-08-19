//package com.uade.EcommerceUniformes.marketplace.service;
//
//import com.uade.EcommerceUniformes.marketplace.entity.Producto;
//import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
//import java.util.ArrayList;
//
//public class ProductoService {
//
//    private ProductoRepository productoRepository = new ProductoRepository();
//
//    public ArrayList<Producto> getProductos() {
//        return productoRepository.getProductos();
//    }
//
//    public Producto getProductoById(int productoId) {
//        return productoRepository.getProductoById(productoId);
//    }
//
//    public ArrayList<Producto> getProductosByCategoria(int categoryId) {
//        return productoRepository.getProductosByCategoria(categoryId);
//    }
//
//    public Producto createProducto(Producto producto) {
//        return productoRepository.createProducto(producto);
//    }
//
//    public double calcularPrecioFinal(Producto producto){
//        double precio = producto.getPrecio();
//        double porcentaje = producto.getDescuentoProducto().getPorcentaje();
//
//        if (producto.getDescuentoProducto() == null){
//            return precio;
//        }
//        if (porcentaje<0 || porcentaje>70){
//            throw new IllegalArgumentException("El descuento debe estar entre 0% y 70%");
//        }
//
//        return precio - ( precio * porcentaje /100 );
//    }
//}