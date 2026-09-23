package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoRequest;

public interface CarritoService {
    public List<Carrito> getCarritos();
    public Optional<Carrito> getCarritoById(Long carritoId);
    public Optional<Carrito> getCarritoByUsuarioId(Long usuarioId);
    public Carrito addProductoToCarrito(Long carritoId, CarritoRequest request);
    public Carrito updateCantidadProducto(Long carritoId,  CarritoRequest request);
    public Carrito removeProductoFromCarrito(Long carritoId, CarritoRequest request);
    public void vaciarCarrito(Long carritoId);
    public Carrito iniciarPago(Long carritoId);
    public Carrito confirmarPago(Long carritoId, CarritoRequest request);
    void expirarCarritosVencidos();
}