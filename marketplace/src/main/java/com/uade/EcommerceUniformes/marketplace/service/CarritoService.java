package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;
import com.uade.EcommerceUniformes.marketplace.entity.Carrito;

public interface CarritoService {
    public List<Carrito> getCarritos();
    public Optional<Carrito> getCarritoById(Long carritoId);
    public Optional<Carrito> getCarritoByUsuarioId(Long usuarioId);
    public Carrito createCarrito(Long usuarioId);
    public Carrito addProductoToCarrito(Long carritoId, Long productoId);
    public Carrito removeProductoFromCarrito(Long carritoId, Long productoId);
}