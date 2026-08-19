//package com.uade.EcommerceUniformes.marketplace.controllers;
//
//import com.uade.EcommerceUniformes.marketplace.entity.Producto;
//import com.uade.EcommerceUniformes.marketplace.service.ProductoService;
//import org.springframework.web.bind.annotation.*;
//import java.util.ArrayList;
//
//@RestController
//@RequestMapping("productos")
//public class ProductoController {
//
//    // GET http://localhost:4002/productos
//    @GetMapping
//    public ArrayList<Producto> getProductos() {
//        ProductoService productoService = new ProductoService();
//        return productoService.getProductos();
//    }
//
//    // GET http://localhost:4002/productos/1
//    @GetMapping("/{productoId}")
//    public Producto getProductoById(@PathVariable int productoId) {
//        ProductoService productoService = new ProductoService();
//        return productoService.getProductoById(productoId);
//    }
//
//    // GET http://localhost:4002/productos/categoria/2
//    @GetMapping("/categoria/{categoryId}")
//    public ArrayList<Producto> getProductosByCategoria(@PathVariable int categoryId) {
//        ProductoService productoService = new ProductoService();
//        return productoService.getProductosByCategoria(categoryId);
//    }
//
//    // POST http://localhost:4002/productos
//    @PostMapping
//    public Producto createProducto(@RequestBody Producto producto) {
//        ProductoService productoService = new ProductoService();
//        return productoService.createProducto(producto);
//    }
//}