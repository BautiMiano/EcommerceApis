package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoryRepository categoryRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public List<Producto> getProductos() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> getProductoById(Long productoId) {
        return productoRepository.findById(productoId);
    }

    @Override
    public List<Producto> getProductosByCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    public Producto createProducto(ProductoRequest request) {

        Usuario vendedor = usuarioRepository.findById(request.getVendedorId())
                .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado con id: " + request.getVendedorId()));

        if (vendedor.getRolUsuario() != Rol.VENDEDOR) {
            throw new RuntimeException("Solo los usuarios vendedores pueden crear productos");
        }

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setTalle(request.getTalle());
        producto.setStock(request.getStock());
        producto.setEstado(request.getEstado());
        producto.setVendedor(vendedor);

        if (request.getCategoryId() != null) {
            Category categoria = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException(
                    "Categoria no encontrada con id: " + request.getCategoryId()
            ));
            producto.setCategoria(categoria);
        }

        return productoRepository.save(producto);
    }

    @Override
    public void desactivarProducto(Long productoId, Long usuarioId) {

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        boolean esDueño = producto.getVendedor().getId().equals(usuarioId);
        boolean esAdmin = usuario.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new RuntimeException("No tenés permiso para eliminar este producto");
        }

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public void activarProducto(Long productoId, Long usuarioId) {

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        boolean esDueño = producto.getVendedor().getId().equals(usuarioId);
        boolean esAdmin = usuario.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new RuntimeException("No tenés permiso para activar este producto");
        }

        producto.setActivo(true);
        productoRepository.save(producto);
    }

    @Override
    public void reservarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        int disponible = producto.getStock() - producto.getStockReservado();
        if (cantidad > disponible) {
            throw new RuntimeException("No hay suficiente stock disponible para el producto con id: " + productoId);
        }
        producto.setStockReservado(producto.getStockReservado() + cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void liberarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setStockReservado(producto.getStockReservado() - cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void descontarStockDefinitivo(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setStock(producto.getStock() - cantidad);
        producto.setStockReservado(producto.getStockReservado() - cantidad);
        productoRepository.save(producto);
    }

    public void modificarStock(Long productoId, Long usuarioId, int nuevoStock) {

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException(
                "Producto no encontrado con id: " + productoId));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException(
                "Usuario no encontrado con id: " + usuarioId));

        boolean esDueño = producto.getVendedor().getId().equals(usuarioId);

        if (!esDueño) {
            throw new RuntimeException(
                    "No tenés permiso para modificar el stock de este producto");
        }

        if (nuevoStock < 0) {
            throw new RuntimeException(
                    "El stock no puede ser negativo");
        }

        producto.setStock(nuevoStock);

        productoRepository.save(producto);
    }
}
