package com.uade.EcommerceUniformes.marketplace.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ItemCarritoRepository;

@Service
public class CarritoServiceImpl implements CarritoService {
    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

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
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    public Carrito createCarrito(Long usuarioId) {
        if (carritoRepository.findByUsuarioId(usuarioId).isPresent())
            throw new Error("El usuario ya tiene un carrito creado");

        Usuario usuario = usuarioService.getUsuarioById(usuarioId)
                .orElseThrow(() -> new Error("Usuario no encontrado con id: " + usuarioId));

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        return carritoRepository.save(carrito);
    }

    public Carrito addProductoToCarrito(Long carritoId, Long productoId, int cantidad) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

        Producto producto = productoService.getProductoById(productoId)
                .orElseThrow(() -> new Error("Producto no encontrado con id: " + productoId));

        Optional<ItemCarrito> itemExistente =
                itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, productoId);

        if (itemExistente.isPresent()) {
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
            itemCarritoRepository.save(item);
        } else {
            if (carrito.getItems() == null)
                carrito.setItems(new ArrayList<>());

            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(cantidad);
            nuevoItem.setPrecioUnitario(producto.getPrecio());
            carrito.getItems().add(nuevoItem);
        }

        return carritoRepository.save(carrito);
    }

    public Carrito updateCantidadProducto(Long carritoId, Long productoId, int cantidad) {
        ItemCarrito item = itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, productoId)
                .orElseThrow(() -> new Error("El producto no se encuentra en el carrito"));

        item.setCantidad(cantidad);
        itemCarritoRepository.save(item);

        return carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));
    }

    public Carrito removeProductoFromCarrito(Long carritoId, Long productoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

        ItemCarrito item = itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, productoId)
                .orElseThrow(() -> new Error("El producto no se encuentra en el carrito"));

        carrito.getItems().remove(item);
        return carritoRepository.save(carrito);
    }
    public void vaciarCarrito(Long carritoId) {
    Carrito carrito = carritoRepository.findById(carritoId)
            .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

    carrito.getItems().clear();
    carritoRepository.save(carrito);
}
}