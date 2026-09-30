package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Descuento;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.repository.DescuentoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;


@Service
public class DescuentoServiceImpl implements DescuentoService {
    @Autowired
    private DescuentoRepository descuentoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    public List<Descuento> getDescuentos() {
        if (descuentoRepository.findAll().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay descuentos disponibles");
        }

        return descuentoRepository.findAll();
    }

    public Optional<Descuento> getDescuentoById(Long descuentoId) {
        if (!descuentoRepository.existsById(descuentoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Descuento no encontrado con id: " + descuentoId);
        }

        return descuentoRepository.findById(descuentoId);
    }

    public Descuento createDescuento(double porcentaje) {
        if (porcentaje <= 0 || porcentaje > 100){throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El porcentaje de descuento debe ser mayor a 0 y menor o igual a 100");
        }
    

        Descuento descuento = new Descuento();
        descuento.setPorcentaje(porcentaje);
        return descuentoRepository.save(descuento);
    }

    public void asignarDescuentoAProducto(Long descuentoId, Long productoId){

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();



        Descuento descuento = descuentoRepository.findById(descuentoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Descuento no encontrado con id: " + descuentoId));
        
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId));
        
        if (producto.getDescuento() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya tiene un descuento asignado");
        }

        if (!producto.getVendedor().getId().equals(usuarioLogueado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para asignar un descuento a este producto");
        }

        producto.setDescuento(descuento);
        productoRepository.save(producto);

    }
    
    public void eliminarDescuentoDeProducto(Long productoId) {

    Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

    Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Producto no encontrado con id: " + productoId));

    boolean esDueño = producto.getVendedor().getId()
            .equals(usuarioLogueado.getId());

    boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

    if (!esDueño && !esAdmin) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "No tienes permiso para eliminar el descuento de este producto");
    }

    if (producto.getDescuento() == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El producto no tiene un descuento asignado");
    }

    producto.setDescuento(null);

    productoRepository.save(producto);
}
}