package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoRequest;

public interface CarritoService {
    public List<CarritoResponse> getCarritos();
    public Optional<CarritoResponse> getCarritoById(Long carritoId);
    public Optional<CarritoResponse> getCarritoByUsuarioId(Long usuarioId);
    public CarritoResponse addProductoToCarrito(Long carritoId, CarritoRequest request);
    public CarritoResponse updateCantidadProducto(Long carritoId,  CarritoRequest request);
    public CarritoResponse removeProductoFromCarrito(Long carritoId, CarritoRequest request);

    public void vaciarCarrito(Long carritoId);

    public CarritoResponse iniciarPago(Long carritoId);
    public CarritoResponse confirmarPago(Long carritoId, CarritoRequest request);
    
    void expirarCarritosVencidos();
}