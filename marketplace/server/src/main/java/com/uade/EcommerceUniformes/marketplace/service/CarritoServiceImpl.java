package com.uade.EcommerceUniformes.marketplace.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ItemCarritoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.OrdenDeCompraRepository;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;

import com.uade.EcommerceUniformes.marketplace.service.UsuarioLogueadoService;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoRequest;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;


    @Autowired
    private ProductoService productoService;

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    public List<Carrito> getCarritos() {

        if (carritoRepository.findAll().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay carritos disponibles");
        }
        return carritoRepository.findAll();
    }

    public Optional<Carrito> getCarritoById(Long carritoId) {
        if (!carritoRepository.existsById(carritoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId);
        }
        return carritoRepository.findById(carritoId);
    }

    public Optional<Carrito> getCarritoByUsuarioId(Long usuarioId) {
    

        return carritoRepository.findByUsuarioId(usuarioId);
    }

    public Carrito addProductoToCarrito(Long carritoId, CarritoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        
        if (!carritoRepository.existsById(carritoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId);
        }
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId));
        if (carrito.getEstado() != EstadoCarrito.ARMADO) {
            throw new RuntimeException(
                    "No se pueden agregar productos a un carrito que no está ARMADO");
        }

        Producto producto = productoService.getProductoById(request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + request.getProductoId()));

        Optional<ItemCarrito> itemExistente
                = itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, request.getProductoId());

        if (itemExistente.isPresent()) {
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + request.getCantidad());
            itemCarritoRepository.save(item);
        } else {
            if (carrito.getItems() == null) {
                carrito.setItems(new ArrayList<>());
            }

            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(request.getCantidad());
            nuevoItem.setPrecioUnitario(producto.getPrecio());
            carrito.getItems().add(nuevoItem);
        }

        return carritoRepository.save(carrito);
    }

    public Carrito updateCantidadProducto(Long carritoId, CarritoRequest request) {
        ItemCarrito item = itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no se encuentra en el carrito"));

        item.setCantidad(request.getCantidad());
        itemCarritoRepository.save(item);

        return carritoRepository.findById(carritoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId));
    }

    public Carrito removeProductoFromCarrito(Long carritoId, CarritoRequest request) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId));

        ItemCarrito item = itemCarritoRepository.findByCarritoIdAndProductoId(carritoId, request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no se encuentra en el carrito"));

        carrito.getItems().remove(item);
        return carritoRepository.save(carrito);
    }

    public void vaciarCarrito(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId));

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
    public Carrito confirmarPago(Long carritoId, CarritoRequest request) {

        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(()
                        -> new RuntimeException("Carrito no encontrado con id: " + carritoId));

        if (carrito.getEstado() != EstadoCarrito.PENDIENTE_PAGO) {
            throw new RuntimeException("El carrito no está pendiente de pago");
        }

        for (ItemCarrito item : carrito.getItems()) {

            productoService.descontarStockDefinitivo(
                    item.getProducto().getId(),
                    item.getCantidad()
            );
        }

        OrdenDeCompra orden = new OrdenDeCompra();

        orden.setUsuario(carrito.getUsuario());
        orden.setFechaCompra(new Date(System.currentTimeMillis()));
        orden.setEstado(EstadoOrden.CONFIRMADA);
        orden.setMetodoDePago(request.getMetodoDePago());
        orden.setItems(new ArrayList<>());

        double total = 0;

        for (ItemCarrito itemCarrito : carrito.getItems()) {

            ItemDeOrdenDeCompra itemOrden = new ItemDeOrdenDeCompra();

            itemOrden.setOrden(orden);
            itemOrden.setProducto(itemCarrito.getProducto());
            itemOrden.setCantidad(itemCarrito.getCantidad());
            itemOrden.setPrecioUnitario(itemCarrito.getPrecioUnitario());

            orden.getItems().add(itemOrden);

            total += itemCarrito.getPrecioUnitario()
                    * itemCarrito.getCantidad();
        }

        orden.setTotal(total);

        ordenDeCompraRepository.save(orden);

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
