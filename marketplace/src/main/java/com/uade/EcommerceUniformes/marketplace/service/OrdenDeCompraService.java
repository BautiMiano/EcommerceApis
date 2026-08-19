//package com.uade.EcommerceUniformes.marketplace.service;
//
//import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
//import com.uade.EcommerceUniformes.marketplace.repository.OrdenDeCompraRepository;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//
//public class OrdenDeCompraService {
//
//    public ArrayList<OrdenDeCompra> getOrdenesDeCompra() {
//        OrdenDeCompraRepository ordenDeCompraRepository = new OrdenDeCompraRepository();
//        return ordenDeCompraRepository.getOrdenesDeCompra();
//    }
//
//    public String getOrdenDeCompraById(@PathVariable int ordenId) {return new String();}
//
//    public String createOrdenDeCompra(@RequestBody String orden) {return orden;}
//}