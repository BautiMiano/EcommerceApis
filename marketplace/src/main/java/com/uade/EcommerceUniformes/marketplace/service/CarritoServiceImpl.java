package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;

@Service
public class CarritoServiceImpl implements CarritoService {
    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProductoService productoService;


    public List<Carrito> getCarritos() {
        return carritoRepository.findAll();
    }

    public Optional<Carrito> getCarritoById(Long carritoId) {
        return carritoRepository.findById(carritoId);
    }

    public Optional<Carrito> getCarritoByUsuarioId(Long usuarioId) {
        return carritoRepository.findById(usuarioId);
    }

    public Carrito createCarrito(Long usuarioId) {
        if (carritoRepository.findById(usuarioId).isPresent())
            throw new Error("El usuario ya tiene un carrito creado");

        Usuario usuario = usuarioService.getUsuarioById(usuarioId)
                .orElseThrow(() -> new Error("Usuario no encontrado con id: " + usuarioId));

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        return carritoRepository.save(carrito);
    }

    public Carrito addProductoToCarrito(Long carritoId, Long productoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

        Producto producto = productoService.getProductoById(productoId)
                .orElseThrow(() -> new Error("Producto no encontrado con id: " + productoId));

        carrito.getProductos().add(producto);
        return carritoRepository.save(carrito);
    }

    public Carrito removeProductoFromCarrito(Long carritoId, Long productoId) {
    Carrito carrito = carritoRepository.findById(carritoId)
            .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

    Producto producto = productoService.getProductoById(productoId)
            .orElseThrow(() -> new Error("Producto no encontrado con id: " + productoId));

    boolean eliminado = carrito.getProductos().remove(producto);
    if (!eliminado)
        throw new Error("El producto no se encuentra en el carrito");

    return carritoRepository.save(carrito);
}
}