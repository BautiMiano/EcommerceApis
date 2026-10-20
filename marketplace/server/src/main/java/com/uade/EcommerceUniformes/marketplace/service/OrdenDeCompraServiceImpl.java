package com.uade.EcommerceUniformes.marketplace.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ItemVentaResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.VentaResponse;
import com.uade.EcommerceUniformes.marketplace.repository.ItemDeOrdenDeCompraRepository;
import com.uade.EcommerceUniformes.marketplace.repository.OrdenDeCompraRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioLogueadoService;


@Service
public class OrdenDeCompraServiceImpl implements OrdenDeCompraService {

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    @Autowired
    private ItemDeOrdenDeCompraRepository itemDeOrdenDeCompraRepository;

    @Autowired
    private ProductoService productoService;

    
    public List<OrdenDeCompra> getOrdenesDeCompra() {
        if (ordenDeCompraRepository.findAll().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay ordenes de compra registradas");
        }

        return ordenDeCompraRepository.findAll();
    }

    public Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId) {
        if (!ordenDeCompraRepository.existsById(ordenId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden de compra no encontrada con id: " + ordenId);
        }
        return ordenDeCompraRepository.findById(ordenId);
    }

    public List<OrdenDeCompra> getOrdenesDeCompraByUsuarioId() {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        List<OrdenDeCompra> ordenesDeCompra = ordenDeCompraRepository.findByUsuarioId(usuarioLogueado.getId());

        if (ordenesDeCompra.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay ordenes de compra registradas para el usuario con id: " + usuarioLogueado.getId());
        }
        return ordenesDeCompra;
    }
    
    public Optional<OrdenDeCompra> getMisOrdenesDeCompraById(Long ordenId) {

    Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

    OrdenDeCompra orden = ordenDeCompraRepository.findById(ordenId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Orden de compra no encontrada con id: " + ordenId
            ));

    if (!orden.getUsuario().getId().equals(usuarioLogueado.getId())) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "No tiene permisos para acceder a esta orden de compra"
        );
    }

    return Optional.of(orden);
    }

    public List<VentaResponse> getMisVentas() {
        Usuario vendedor = usuarioLogueadoService.obtenerUsuarioLogueado();

        // Agrupa los ítems del vendedor por orden, manteniendo el orden de la más nueva a la más vieja
        Map<Long, List<ItemDeOrdenDeCompra>> itemsPorOrden = itemDeOrdenDeCompraRepository
                .findByProductoVendedorIdOrderByOrdenIdDesc(vendedor.getId())
                .stream()
                .collect(Collectors.groupingBy(item -> item.getOrden().getId(), LinkedHashMap::new, Collectors.toList()));

        return itemsPorOrden.values().stream()
                .map(items -> aVentaResponse(items.get(0).getOrden(), items))
                .toList();
    }

    public VentaResponse getMiVentaById(Long ordenId) {
        Usuario vendedor = usuarioLogueadoService.obtenerUsuarioLogueado();
        OrdenDeCompra orden = obtenerOrden(ordenId);
        return aVentaResponse(orden, itemsDelVendedor(orden, vendedor));
    }

    @Transactional
    public VentaResponse cambiarEstadoMiVenta(Long ordenId, EstadoOrden nuevoEstado) {
        Usuario vendedor = usuarioLogueadoService.obtenerUsuarioLogueado();
        OrdenDeCompra orden = obtenerOrden(ordenId);
        List<ItemDeOrdenDeCompra> items = itemsDelVendedor(orden, vendedor);

        if (nuevoEstado == null || !estadosSiguientes(orden.getEstado()).contains(nuevoEstado)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede pasar el pedido de " + orden.getEstado() + " a " + nuevoEstado
            );
        }

        // Al cancelar, las unidades vuelven al stock de cada talle
        if (nuevoEstado == EstadoOrden.CANCELADA) {
            for (ItemDeOrdenDeCompra item : orden.getItems()) {
                productoService.devolverStock(item.getProducto().getId(), item.getTalle(), item.getCantidad());
            }
        }

        orden.setEstado(nuevoEstado);
        ordenDeCompraRepository.save(orden);
        return aVentaResponse(orden, items);
    }

    /** Avance del pedido: PENDIENTE → CONFIRMADA → ENVIADA → ENTREGADA, y se puede cancelar antes del envío. */
    private List<EstadoOrden> estadosSiguientes(EstadoOrden estado) {
        return switch (estado) {
            case PENDIENTE -> List.of(EstadoOrden.CONFIRMADA, EstadoOrden.CANCELADA);
            case CONFIRMADA -> List.of(EstadoOrden.ENVIADA, EstadoOrden.CANCELADA);
            case ENVIADA -> List.of(EstadoOrden.ENTREGADA);
            case ENTREGADA, CANCELADA -> List.of();
        };
    }

    private OrdenDeCompra obtenerOrden(Long ordenId) {
        return ordenDeCompraRepository.findById(ordenId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Orden de compra no encontrada con id: " + ordenId
                ));
    }

    // Los ítems del vendedor en la orden; si no tiene ninguno, la orden no es suya
    private List<ItemDeOrdenDeCompra> itemsDelVendedor(OrdenDeCompra orden, Usuario vendedor) {
        List<ItemDeOrdenDeCompra> items = itemDeOrdenDeCompraRepository
                .findByOrdenIdAndProductoVendedorId(orden.getId(), vendedor.getId());

        if (items.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tiene permisos para acceder a esta orden de compra"
            );
        }
        return items;
    }

    // Arma la venta solo con los ítems del vendedor, sin exponer productos ni montos de otros vendedores
    private VentaResponse aVentaResponse(OrdenDeCompra orden, List<ItemDeOrdenDeCompra> items) {
        List<ItemVentaResponse> itemsVenta = items.stream()
                .map(item -> new ItemVentaResponse(
                        item.getProducto().getId(),
                        item.getProducto().getNombre(),
                        item.getTalle() != null ? item.getTalle().name() : null,
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getCantidad() * item.getPrecioUnitario()))
                .toList();

        int cantidadProductos = itemsVenta.stream().mapToInt(ItemVentaResponse::getCantidad).sum();
        double total = itemsVenta.stream().mapToDouble(ItemVentaResponse::getSubtotal).sum();

        Usuario comprador = orden.getUsuario();
        String nombreComprador = comprador.getApellido() == null
                ? comprador.getNombre()
                : comprador.getNombre() + " " + comprador.getApellido();

        return new VentaResponse(
                orden.getId(),
                orden.getFechaCompra(),
                orden.getEstado(),
                nombreComprador,
                comprador.getMail(),
                comprador.getTelefono(),
                cantidadProductos,
                total,
                itemsVenta,
                estadosSiguientes(orden.getEstado()));
    }
}
