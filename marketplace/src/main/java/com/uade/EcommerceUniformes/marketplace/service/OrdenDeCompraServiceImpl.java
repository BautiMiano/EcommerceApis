package com.uade.EcommerceUniformes.marketplace.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
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

        List<Producto> productos = productoRepository.findAllById(request.getProductosIds());

        if (productos.size() != request.getProductosIds().size()) {
            throw new RuntimeException("Uno o más productos no existen");
        }

        double total = 0;

        for (Producto producto : productos) {
            total += producto.getPrecio();
        }

        OrdenDeCompra orden = new OrdenDeCompra();

        orden.setUsuario(usuario);
        orden.setFechaCompra(new Date(System.currentTimeMillis()));
        orden.getItems();
        orden.setTotal(total);
        orden.setEstado(EstadoOrden.PENDIENTE);
        orden.setComprobante(request.getComprobante());
        orden.setMetodoDePago(request.getMetodoDePago());

        return ordenDeCompraRepository.save(orden);
    }


}