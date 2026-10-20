package com.uade.EcommerceUniformes.marketplace.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
import com.uade.EcommerceUniformes.marketplace.entity.StockTalle;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;
import com.uade.EcommerceUniformes.marketplace.entity.MetodoDePago;
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
                    item.getPrecioUnitario() * item.getCantidad(),
                    item.getTalle() != null ? item.getTalle().name() : null,
                    item.getProducto().getCategoria() != null ? item.getProducto().getCategoria().getNombre() : null,
                    item.getProducto().getVendedor().getNombreUsuario(),
                    productoService.getImagenPrincipal(item.getProducto())
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

    private void exigirTalle(Talle talle) {
        if (talle == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar el talle");
        }
    }

    private void exigirStockDisponible(Producto producto, Talle talle, int cantidadTotal) {
        StockTalle stockTalle = producto.buscarTalle(talle)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "El producto " + producto.getNombre() + " no tiene el talle " + talle));
        if (cantidadTotal > stockTalle.getStockDisponible()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No hay stock suficiente para el producto: " + producto.getNombre() + " en talle " + talle);
        }
    }

    private Optional<ItemCarrito> buscarItem(Carrito carrito, Long productoId, Talle talle) {
        if (carrito.getItems() == null) {
            return Optional.empty();
        }
        return carrito.getItems().stream()
                .filter(i -> i.getProducto().getId().equals(productoId) && i.getTalle() == talle)
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

        Optional<Carrito> carrito = carritoRepository.findByUsuarioId(usuarioId);

        // Compradores viejos que se registraron sin carrito
        if (carrito.isEmpty() && logueado.getId().equals(usuarioId) && logueado.getRolUsuario() == Rol.COMPRADOR) {
            carrito = Optional.of(crearCarritoNuevo(logueado));
        }

        return carrito.map(this::convertirACarritoResponse);
    }

    // ---------- modificaciones ----------

    @Override
    @Transactional
    public CarritoResponse addProductoToCarrito(Long carritoId, CarritoRequest request) {
        exigirCantidadValida(request.getCantidad());
        exigirTalle(request.getTalle());

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

        Optional<ItemCarrito> existente = buscarItem(carrito, request.getProductoId(), request.getTalle());

        if (existente.isPresent()) {
            ItemCarrito item = existente.get();
            int nuevaCantidad = item.getCantidad() + request.getCantidad();
            exigirStockDisponible(producto, request.getTalle(), nuevaCantidad);
            item.setCantidad(nuevaCantidad);
        } else {
            exigirStockDisponible(producto, request.getTalle(), request.getCantidad());

            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setTalle(request.getTalle());
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
        exigirTalle(request.getTalle());

        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        ItemCarrito item = buscarItem(carrito, request.getProductoId(), request.getTalle())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El producto no se encuentra en el carrito"));

        exigirStockDisponible(item.getProducto(), item.getTalle(), request.getCantidad());
        item.setCantidad(request.getCantidad());

        return convertirACarritoResponse(carritoRepository.save(carrito));
    }

    @Override
    @Transactional
    public CarritoResponse removeProductoFromCarrito(Long carritoId, CarritoRequest request) {
        exigirTalle(request.getTalle());

        Carrito carrito = obtenerCarritoPropio(carritoId);
        exigirArmado(carrito);

        ItemCarrito item = buscarItem(carrito, request.getProductoId(), request.getTalle())
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
            productoService.reservarStock(item.getProducto().getId(), item.getTalle(), item.getCantidad());
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

        // Una orden por vendedor: así cada vendedor maneja el estado de su pedido sin afectar a los demás
        Map<Long, List<ItemCarrito>> itemsPorVendedor = carrito.getItems().stream()
                .collect(Collectors.groupingBy(
                        item -> item.getProducto().getVendedor().getId(), LinkedHashMap::new, Collectors.toList()));

        for (List<ItemCarrito> itemsDelVendedor : itemsPorVendedor.values()) {
            crearOrden(carrito.getUsuario(), itemsDelVendedor, request.getMetodoDePago());
        }

        // La compra queda en la orden: el mismo carrito se vacía para seguir comprando
        carrito.getItems().clear();
        carrito.setEstado(EstadoCarrito.ARMADO);
        carrito.setFechaInicioPago(null);

        return convertirACarritoResponse(carritoRepository.save(carrito));
    }

    // Crea la orden confirmada con los ítems de un mismo vendedor y descuenta su stock
    private void crearOrden(Usuario comprador, List<ItemCarrito> items, MetodoDePago metodoDePago) {
        OrdenDeCompra orden = new OrdenDeCompra();
        orden.setUsuario(comprador);
        orden.setFechaCompra(new Date(System.currentTimeMillis()));
        orden.setEstado(EstadoOrden.CONFIRMADA);
        orden.setMetodoDePago(metodoDePago);
        orden.setItems(new ArrayList<>());

        double total = 0;

        for (ItemCarrito itemCarrito : items) {
            productoService.descontarStockDefinitivo(
                    itemCarrito.getProducto().getId(), itemCarrito.getTalle(), itemCarrito.getCantidad());

            ItemDeOrdenDeCompra itemOrden = new ItemDeOrdenDeCompra();
            itemOrden.setOrden(orden);
            itemOrden.setProducto(itemCarrito.getProducto());
            itemOrden.setTalle(itemCarrito.getTalle());
            itemOrden.setCantidad(itemCarrito.getCantidad());
            itemOrden.setPrecioUnitario(itemCarrito.getPrecioUnitario());
            orden.getItems().add(itemOrden);

            total += itemCarrito.getPrecioUnitario() * itemCarrito.getCantidad();
        }

        orden.setTotal(total);
        ordenDeCompraRepository.save(orden);
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
                productoService.liberarStock(item.getProducto().getId(), item.getTalle(), item.getCantidad());
            }
            // Vuelve a ARMADO con los mismos productos para que el comprador pueda reintentar el pago
            carrito.setEstado(EstadoCarrito.ARMADO);
            carrito.setFechaInicioPago(null);
            carritoRepository.save(carrito);
        }
    }
}
