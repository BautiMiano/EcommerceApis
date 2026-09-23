package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    private final UsuarioLogueadoService usuarioLogueadoService;

    @Override
    public List<Producto> getProductos() {
        if (productoRepository.findAll().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay productos disponibles");
        }
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> getProductoById(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId);
        }
        return productoRepository.findById(productoId);
    }

    @Override
    public List<Producto> getProductosByCategoria(Long categoriaId) {
        if (!categoryRepository.existsById(categoriaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + categoriaId);
        }
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    public Producto createProducto(ProductoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        
        Usuario vendedor = usuarioRepository.findById(request.getVendedorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendedor no encontrado con id: " + request.getVendedorId()));
        
        if (vendedor.getRolUsuario() != Rol.VENDEDOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los usuarios vendedores pueden crear productos");
        }

        if (!vendedor.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El usuario vendedor está desactivado y no puede crear productos");
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
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + request.getCategoryId()));
            producto.setCategoria(categoria);
        }

        return productoRepository.save(producto);
    }

    @Override
    public void desactivarProducto(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId));

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario desactivado no puede desactivar productos");
        }
        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tenés permiso para eliminar este producto");
        }
        if(!producto.isActivo()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está desactivado");
        }

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public void activarProducto(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId));

        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tenés permiso para activar este producto");
        }

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario desactivado no puede activar productos");
        }

        if (producto.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está activo");
        }


        producto.setActivo(true);
        productoRepository.save(producto);
    }

    @Override
    public void reservarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        int disponible = producto.getStock() - producto.getStockReservado();
        if (cantidad > disponible) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No hay suficiente stock disponible para el producto con id: " + productoId);
        }
        producto.setStockReservado(producto.getStockReservado() + cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void liberarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        producto.setStockReservado(producto.getStockReservado() - cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void descontarStockDefinitivo(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        producto.setStock(producto.getStock() - cantidad);
        producto.setStockReservado(producto.getStockReservado() - cantidad);
        productoRepository.save(producto);
    }

    public void modificarStock(ProductoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(request.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + request.getId()));
        
        if (usuarioLogueado.getRolUsuario() != Rol.VENDEDOR) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo los usuarios vendedores pueden modificar el stock");
        }

        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());

        if (!esDueño) {
            throw new ResponseStatusException(
        HttpStatus.FORBIDDEN,
        "No se puede modificar el stock de otro vendedor");
        }

        if (request.getStock() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El stock no puede ser negativo");
        }

        int nuevoStock = producto.getStock() + request.getStock(); 

        producto.setStock(nuevoStock);

        productoRepository.save(producto);
    }
}
