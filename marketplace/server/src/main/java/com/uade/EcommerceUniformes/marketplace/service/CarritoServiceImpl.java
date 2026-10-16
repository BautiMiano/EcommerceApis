package com.uade.EcommerceUniformes.marketplace.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.ItemCarrito;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CarritoResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ItemCarritoResponse;
import com.uade.EcommerceUniformes.marketplace.repository.CarritoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.OrdenDeCompraRepository;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    // ---------- helpers ----------

    private CarritoResponse convertirACarritoResponse(Carrito carrito) {

        List<ItemCarritoResponse> itemsResponse = new ArrayList<>();

        if (carrito.getItems() != null) {
            itemsResponse = carrito.getItems()
                    .stream()
                    .map(item -> new ItemCarritoResponse(
                    item.getProducto().getId(),
                    item.getProducto().getNombre(),
                    item.getCantidad(),
                    item.getPrecioUnitario(),
                    item.getPrecioUnitario() * item.getCantidad()
            ))
                    .toList();
        }

        double total = itemsResponse.stream()
                .mapToDouble(ItemCarritoResponse::getSubtotal)
                .sum();

        return new CarritoResponse(
                carrito.getId(),
                carrito.getEstado().name(),
                carrito.getUsuario().getId(),
                itemsResponse,
                total
        );
    }

    private boolean esAdmin(Usuario usuario) {
        return usuario.getRolUsuario() == Rol.ADMIN;
    }

    /** Devuelve el carrito solo si es del usuario logueado (o si es ADMIN). */
    private Carrito obtenerCarritoPropio(Long carritoId) {
        Usuario logueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Carrito no encontrado con id: " + carritoId));

        if (!esAdmin(logueado) && !carrito.getUsuario().getId().equals(logueado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ese carrito no te pertenece");
        }
        return carrito;
    }

    private void exigirArmado(Carrito carrito) {
        if (carrito.getEstado() != EstadoCarrito.ARMADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Solo se puede modificar un carrito en estado ARMADO");
        }
    }

    private void exigirCantidadValida(int cantidad) {
        if (cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0");
        }
    }

    private void exigirStockDisponible(Producto producto, int cantidadTotal) {
        int disponible = producto.getStock() - producto.getStockReservado();
        if (cantidadTotal > disponible) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No hay stock suficiente para el producto: " + producto.getNombre());
        }
    }

    private Optional<ItemCarrito> buscarItem(Carrito carrito, Long productoId) {
        if (carrito.getItems() == null) {
            return Optional.empty();
        }
        return carrito.getItems().stream()
                .filter(i -> i.getProducto().getId().equals(productoId))
                .findFirst();
    }

    /** Cada comprador siempre debe tener un carrito ARMADO disponible. */
    private Carrito crearCarritoNuevo(Usuario usuario) {
        Carrito nuevo = new Carrito();
        nuevo.setUsuario(usuario);
        nuevo.setEstado(EstadoCarrito.ARMADO);
        nuevo.setItems(new ArrayList<>());
        return carritoRepository.save(nuevo);
    }

    // ---------- consultas ----------

    @Override
    public List<CarritoResponse> getCarritos() {
        return carritoRepository.findAll()
                .stream()
                .map(this::convertirACarritoResponse)
                .toList();
    }

    @Override
    public Optional<CarritoResponse> getCarritoById(Long carritoId) {
        return Optional.of(convertirACarritoResponse(obtenerCarritoPropio(carritoId)));
    }

    @Override
    @Transactional
    public Optional<CarritoResponse> getCarritoByUsuarioId(Long usuarioId) {
        Usuario logueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        if (!esAdmin(logueado) && !logueado.getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No podes ver el carrito de otro usuario");
        }

        Optional<Carrito> armado = carritoRepository.findByUsuarioIdAndEstado(usuarioId, EstadoCarrito.ARMADO);

        // Compradores viejos que ya pagaron/expiraron y se quedaron sin carrito armado
        if (armado.isEmpty() && logueado.getId().equals(usuarioId) && logueado.getRolUsuario() == Rol.COMPRADOR) {
            armado = Optional.of(crearCarritoNuevo(logueado));
        }

        return armado.map(this::convertirACarritoResponse);
    }

    // ---------- modificaciones ----------

    @Override
    @Transactional
    public CarritoResponse addProductoToCarrito(Long carritoId, CarritoRequest request) {
        exigirCantidadValida(request.getCantidad());

        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        Producto producto = productoService.getProductoEntityById(request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + request.getProductoId()));

        if (!producto.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto no esta disponible");
        }

        if (carrito.getItems() == null) {
            carrito.setItems(new ArrayList<>());
        }

        Optional<ItemCarrito> existente = buscarItem(carrito, request.getProductoId());

        if (existente.isPresent()) {
            ItemCarrito item = existente.get();
            int nuevaCantidad = item.getCantidad() + request.getCantidad();
            exigirStockDisponible(producto, nuevaCantidad);
            item.setCantidad(nuevaCantidad);
        } else {
            exigirStockDisponible(producto, request.getCantidad());

            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(request.getCantidad());
            nuevoItem.setPrecioUnitario(producto.getPrecio());
            carrito.getItems().add(nuevoItem);
        }

        return convertirACarritoResponse(carritoRepository.save(carrito));
    }

    @Override
    @Transactional
    public CarritoResponse updateCantidadProducto(Long carritoId, CarritoRequest request) {
        exigirCantidadValida(request.getCantidad());

        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        ItemCarrito item = buscarItem(carrito, request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El producto no se encuentra en el carrito"));

        exigirStockDisponible(item.getProducto(), request.getCantidad());
        item.setCantidad(request.getCantidad());

        return convertirACarritoResponse(carritoRepository.save(carrito));
    }

    @Override
    @Transactional
    public CarritoResponse removeProductoFromCarrito(Long carritoId, CarritoRequest request) {
        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        ItemCarrito item = buscarItem(carrito, request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El producto no se encuentra en el carrito"));

        carrito.getItems().remove(item);
        return convertirACarritoResponse(carritoRepository.save(carrito));
    }

    @Override
    @Transactional
    public void vaciarCarrito(Long carritoId) {
        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        if (carrito.getItems() != null) {
            carrito.getItems().clear();
        }
        carritoRepository.save(carrito);
    }

    // ---------- pago ----------

    @Override
    @Transactional
    public CarritoResponse iniciarPago(Long carritoId) {
        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito esta vacio");
        }

        for (ItemCarrito item : carrito.getItems()) {
            productoService.reservarStock(item.getProducto().getId(), item.getCantidad());
        }

        carrito.setEstado(EstadoCarrito.PENDIENTE_PAGO);
        carrito.setFechaInicioPago(LocalDateTime.now());

        return convertirACarritoResponse(carritoRepository.save(carrito));
    }

    @Override
    @Transactional
    public CarritoResponse confirmarPago(Long carritoId, CarritoRequest request) {
        Carrito carrito = obtenerCarritoPropio(carritoId);

        if (carrito.getEstado() != EstadoCarrito.PENDIENTE_PAGO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito no esta pendiente de pago");
        }
        if (request.getMetodoDePago() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar el metodo de pago");
        }

        OrdenDeCompra orden = new OrdenDeCompra();
        orden.setUsuario(carrito.getUsuario());
        orden.setFechaCompra(new Date(System.currentTimeMillis()));
        orden.setEstado(EstadoOrden.CONFIRMADA);
        orden.setMetodoDePago(request.getMetodoDePago());
        orden.setItems(new ArrayList<>());

        double total = 0;

        for (ItemCarrito itemCarrito : carrito.getItems()) {
            productoService.descontarStockDefinitivo(
                    itemCarrito.getProducto().getId(), itemCarrito.getCantidad());

            ItemDeOrdenDeCompra itemOrden = new ItemDeOrdenDeCompra();
            itemOrden.setOrden(orden);
            itemOrden.setProducto(itemCarrito.getProducto());
            itemOrden.setCantidad(itemCarrito.getCantidad());
            itemOrden.setPrecioUnitario(itemCarrito.getPrecioUnitario());
            orden.getItems().add(itemOrden);

            total += itemCarrito.getPrecioUnitario() * itemCarrito.getCantidad();
        }

        orden.setTotal(total);
        ordenDeCompraRepository.save(orden);

        carrito.setEstado(EstadoCarrito.PAGADO);
        Carrito guardado = carritoRepository.save(carrito);

        // El comprador queda con un carrito nuevo para seguir comprando
        crearCarritoNuevo(carrito.getUsuario());

        return convertirACarritoResponse(guardado);
    }

    @Override
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

            crearCarritoNuevo(carrito.getUsuario());
        }
    }
}
