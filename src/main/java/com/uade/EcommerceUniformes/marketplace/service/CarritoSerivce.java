//package com.uade.EcommerceUniformes.marketplace.service;
//
//import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
//import com.uade.EcommerceUniformes.marketplace.entity.Producto;
//import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;
//
//import java.util.ArrayList;
//
//public class CarritoSerivce {
//    private CarritoRepository carritoRepository = new CarritoRepository();
//    private ProductoService productoService = new ProductoService();
//
//    public ArrayList<Carrito> getCarritos() {
//        return carritoRepository.getCarritos();
//    }
//
//    public Carrito getCarritoByUsuarioId(int usuarioId) {
//        return carritoRepository.getCarritoByUsuarioId(usuarioId);
//    }
//
//    public Carrito addProductoToCarrito(int usuarioId, int productoId) {
//        Producto producto = productoService.getProductoById(productoId);
//        if (producto != null) {
//            return carritoRepository.addProductoToCarrito(usuarioId, producto);
//        }
//        return null; // Producto no encontrado
//    }
//}