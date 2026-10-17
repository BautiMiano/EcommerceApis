package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;
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
}
