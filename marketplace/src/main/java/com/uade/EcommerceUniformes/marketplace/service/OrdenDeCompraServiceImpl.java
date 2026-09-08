package com.uade.EcommerceUniformes.marketplace.service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ItemOrdenRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.OrdenDeCompraRequest;
import com.uade.EcommerceUniformes.marketplace.repository.OrdenDeCompraRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

@Service
public class OrdenDeCompraServiceImpl implements OrdenDeCompraService {

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<OrdenDeCompra> getOrdenesDeCompra() {
        return ordenDeCompraRepository.findAll();
    }

    public Optional<OrdenDeCompra> getOrdenDeCompraById(Long ordenId) {
        return ordenDeCompraRepository.findById(ordenId);
    }

    public OrdenDeCompra createOrdenDeCompra(OrdenDeCompraRequest request) {

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado con id: " + request.getUsuarioId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("La orden de compra debe tener al menos un item");
        }
        double total = 0;

        OrdenDeCompra orden = new OrdenDeCompra();
        orden.setUsuario(usuario);
        orden.setFechaCompra(new Date(System.currentTimeMillis()));
        orden.getItems();

        orden.setTotal(total);
        orden.setEstado(EstadoOrden.CONFIRMADA);
        orden.setComprobante(request.getComprobante());
        orden.setMetodoDePago(request.getMetodoDePago());

        List<ItemDeOrdenDeCompra> items = new ArrayList<>();

        for (ItemOrdenRequest itemReq : request.getItems()) {

            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException(
                    "Producto no encontrado con id: " + itemReq.getProductoId()));

            if (itemReq.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a 0 para el producto: " + producto.getNombre());
            }

            int disponible = producto.getStock() - producto.getStockReservado();
            if (itemReq.getCantidad() > disponible) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            ItemDeOrdenDeCompra item = new ItemDeOrdenDeCompra();
            item.setOrden(orden);
            item.setProducto(producto);
            item.setCantidad(itemReq.getCantidad());
            item.setPrecioUnitario(producto.getPrecio());
            items.add(item);

            total += producto.getPrecio() * itemReq.getCantidad();

            producto.setStock(producto.getStock() - itemReq.getCantidad());
            productoRepository.save(producto);
        }

        orden.setItems(items);
        orden.setTotal(total);

        return ordenDeCompraRepository.save(orden);

    }

}
