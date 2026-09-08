package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;

public interface CarritoService {
    public List<Carrito> getCarritos();
    public Optional<Carrito> getCarritoById(Long carritoId);
    public Optional<Carrito> getCarritoByUsuarioId(Long usuarioId);
    public Carrito createCarrito(Long usuarioId);
    public Carrito addProductoToCarrito(Long carritoId, Long productoId, int cantidad);
    public Carrito updateCantidadProducto(Long carritoId, Long productoId, int cantidad);
    public Carrito removeProductoFromCarrito(Long carritoId, Long productoId);
    public void vaciarCarrito(Long carritoId);
    public Carrito iniciarPago(Long carritoId);
    public Carrito confirmarPago(Long carritoId, MetodoDePago metodoDePago);
    void expirarCarritosVencidos();
}