//package com.uade.EcommerceUniformes.marketplace.controllers;
//
//import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
//import com.uade.EcommerceUniformes.marketplace.service.CarritoSerivce;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//
//@RestController
//@RequestMapping("carritos")
//public class CarritoController {
//
//    @GetMapping
//    public ArrayList<Carrito> getCarritos() {
//        CarritoSerivce carritoService = new CarritoSerivce();
//        return carritoService.getCarritos();
//    }
//
//    @GetMapping("/usuario/{usuarioId}")
//    public Carrito getCarritoByUsuarioId(@PathVariable int usuarioId) {
//        CarritoSerivce carritoService = new CarritoSerivce();
//        return carritoService.getCarritoByUsuarioId(usuarioId);
//    }
//
//    @PostMapping("/usuario/{usuarioId}/agregar-producto/{productoId}")
//    public Carrito addProductoToCarrito(@PathVariable int usuarioId, @PathVariable int productoId) {
//        CarritoSerivce carritoService = new CarritoSerivce();
//        return carritoService.addProductoToCarrito(usuarioId, productoId);
//    }
//}