//package com.uade.EcommerceUniformes.marketplace.controllers;
//
//import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
//import com.uade.EcommerceUniformes.marketplace.service.OrdenDeCompraService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//@RestController
//@RequestMapping("ordenesDeCompra")
//public class OrdenDeCompraController {
//
//    @GetMapping
//    public ArrayList<OrdenDeCompra> getOrdenesDeCompra() {
//        OrdenDeCompraService ordenDeCompraService = new OrdenDeCompraService();
//        return ordenDeCompraService.getOrdenesDeCompra();
//    }
//
//    @GetMapping("/{ordenId}")
//    public String getOrdenDeCompraById(@PathVariable int ordenId) {
//        OrdenDeCompraService ordenDeCompraService = new OrdenDeCompraService();
//        return ordenDeCompraService.getOrdenDeCompraById(ordenId);
//    }
//
//    @PostMapping
//    public String createOrdenDeCompra(@RequestBody String orden) {
//        OrdenDeCompraService ordenDeCompraService = new OrdenDeCompraService();
//        return ordenDeCompraService.createOrdenDeCompra(orden);
//    }
//}