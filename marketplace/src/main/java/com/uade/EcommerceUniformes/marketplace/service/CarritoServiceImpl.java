package com.uade.EcommerceUniformes.marketplace.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ItemCarritoRepository;

import jakarta.transaction.Transactional;

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

        Usuario usuario = usuarioService.getUsuarioById(usuarioId)
                .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado con id: " + usuarioId));

        if (usuario.getRolUsuario() != Rol.COMPRADOR) {
            throw new RuntimeException(
                    "Solo los usuarios compradores pueden crear un carrito");
        }

        Optional<Carrito> carritoExistente = carritoRepository.findByUsuarioId(usuarioId);

        if (carritoExistente.isPresent()) {

            Carrito carrito = carritoExistente.get();

            if (carrito.getEstado() == EstadoCarrito.ARMADO
                    || carrito.getEstado() == EstadoCarrito.PENDIENTE_PAGO) {

                throw new RuntimeException(
                        "El usuario ya tiene un carrito activo");
            }
        }

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        carrito.setEstado(EstadoCarrito.ARMADO);

        return carritoRepository.save(carrito);
    }

    public Carrito addProductoToCarrito(Long carritoId, Long productoId, int cantidad) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));
        if (carrito.getEstado() != EstadoCarrito.ARMADO) {
            throw new RuntimeException(
                    "No se pueden agregar productos a un carrito que no está ARMADO");
        }

        Producto producto = productoService.getProductoById(productoId)
                .orElseThrow(() -> new Error("Producto no encontrado con id: " + productoId));

        Optional<ItemCarrito> itemExistente
                = itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, productoId);

        if (itemExistente.isPresent()) {
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
            itemCarritoRepository.save(item);
        } else {
            if (carrito.getItems() == null) {
                carrito.setItems(new ArrayList<>());
            }

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

    @Transactional
    public Carrito iniciarPago(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

        if (carrito.getEstado() != EstadoCarrito.ARMADO) {
            throw new Error("El carrito no se encuentra en estado ARMADO");
        }

        for (ItemCarrito item : carrito.getItems()) {
            productoService.reservarStock(item.getProducto().getId(), item.getCantidad());
        }

        carrito.setEstado(EstadoCarrito.PENDIENTE_PAGO);
        carrito.setFechaInicioPago(LocalDateTime.now());

        return carritoRepository.save(carrito);
    }

    @Transactional
    public Carrito confirmarPago(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new Error("Carrito no encontrado con id: " + carritoId));

        if (carrito.getEstado() != EstadoCarrito.PENDIENTE_PAGO) {
            throw new Error("El carrito no está pendiente de pago");
        }

        for (ItemCarrito item : carrito.getItems()) {
            productoService.descontarStockDefinitivo(item.getProducto().getId(), item.getCantidad());
        }

        carrito.setEstado(EstadoCarrito.PAGADO);

        return carritoRepository.save(carrito);
    }

    @Scheduled(fixedRate = 60000) // corre cada 1 minuto
    @Transactional
    public void expirarCarritosVencidos() {
        LocalDateTime limite = LocalDateTime.now().minusMinutes(15);

        List<Carrito> vencidos = carritoRepository
                .findByEstadoAndFechaInicioPagoBefore(EstadoCarrito.PENDIENTE_PAGO, limite);

        for (Carrito carrito : vencidos) {
            for (ItemCarrito item : carrito.getItems()) {
                productoService.liberarStock(item.getProducto().getId(), item.getCantidad());
            }
            carrito.setEstado(EstadoCarrito.EXPIRADO);
            carritoRepository.save(carrito);
        }
    }
}
