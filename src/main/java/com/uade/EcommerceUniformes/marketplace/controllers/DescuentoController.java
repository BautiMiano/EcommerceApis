//package com.uade.EcommerceUniformes.marketplace.controllers;
//
//import com.uade.EcommerceUniformes.marketplace.entity.Descuento;
//import com.uade.EcommerceUniformes.marketplace.service.DescuentoService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//
//@RestController
//@RequestMapping("descuentos")
//
//public class DescuentoController {
//
//    @GetMapping
//    public ArrayList<Descuento> getDescuento(){
//        DescuentoService descuentoService = new DescuentoService();
//        return descuentoService.getDescuento();
//    }
//
//    @GetMapping("/{descuentoId}")
//    public String getDescuentoById(@PathVariable int descuentoId){
//        DescuentoService descuentoService = new DescuentoService();
//        return descuentoService.getDescuentoById(descuentoId);
//    }
//
//    @PostMapping
//    public String createDescuento(@RequestBody String descuento){
//        DescuentoService descuentoService = new DescuentoService();
//        return descuentoService.createDescuento(descuento);
//    }
//}
