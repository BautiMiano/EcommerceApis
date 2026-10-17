package com.uade.EcommerceUniformes.marketplace.service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.Imagen;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

import io.jsonwebtoken.lang.Collections;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoryRepository categoryRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioLogueadoService usuarioLogueadoService;

    private ProductoRequest toResponse(Producto producto) {
        ProductoRequest response = new ProductoRequest();
        response.setId(producto.getId());

        if (producto.getCategoria() != null) {
            response.setCategoryId(producto.getCategoria().getId());
        }

        response.setNombre(producto.getNombre());
        response.setDescripcion(producto.getDescripcion());
        response.setPrecio(producto.getPrecio());
        response.setTalle(producto.getTalle());
        response.setStock(producto.getStock());
        response.setActivo(producto.isActivo());

        if (producto.getImagenes() != null) {
            List<String> imagenesBase64 = producto.getImagenes().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getActivo()))
                    .map(img -> {
                        try {
                            if (img.getImagen() != null) {
                                byte[] bytes = img.getImagen().getBytes(1, (int) img.getImagen().length());
                                String tipoContenido = img.getTipoContenido() == null
                                        ? "application/octet-stream"
                                        : img.getTipoContenido();
                                return "data:" + tipoContenido + ";base64,"
                                        + Base64.getEncoder().encodeToString(bytes);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        return null;
                    })
                    .filter(b64 -> b64 != null)
                    .toList();

            response.setImagenes(imagenesBase64);
        }

        return response;
    }

    @Override
    public List<ProductoRequest> getProductos() {

        List<Producto> productos = productoRepository.findAll();

        if (productos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay productos disponibles");
        }

        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public ProductoRequest getProductoById(Long productoId) {

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        return toResponse(producto);
    }

    @Override
    public List<ProductoRequest> getProductosByCategoria(Long categoriaId) {

        if (!categoryRepository.existsById(categoriaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + categoriaId);
        }

        List<Producto> productos = productoRepository.findByCategoriaId(categoriaId);

        return productos.stream().map(this::toResponse).toList();
    }

    public List<ProductoRequest> getMisProductos() {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        List<Producto> productos = productoRepository.findByVendedorId(usuarioLogueado.getId());

        if (productos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No hay productos disponibles para el vendedor con id: " + usuarioLogueado.getId());
        }

        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public ProductoRequest createProducto(ProductoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        if (usuarioLogueado.getRolUsuario() != Rol.VENDEDOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo los usuarios vendedores pueden crear productos");
        }

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "El usuario vendedor está desactivado y no puede crear productos");
        }

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setTalle(request.getTalle());
        producto.setStock(request.getStock());
        producto.setEstado(request.getEstado());
        producto.setVendedor(usuarioLogueado);

        if (request.getCategoryId() != null) {
            Category categoria = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Categoria no encontrada con id: " + request.getCategoryId()));
            producto.setCategoria(categoria);
        }

        if (producto.getCategoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto debe tener una categoria asociada");
        }

        if (producto.getStock() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo");
        }

        if (producto.getPrecio() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio no puede ser negativo");
        }

        if (producto.getNombre() == null || producto.getNombre().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del producto no puede estar vacío");
        }

        productoRepository.save(producto);

        ProductoRequest productoRequest = new ProductoRequest();
        productoRequest.setId(producto.getId());
        productoRequest.setNombre(producto.getNombre());
        productoRequest.setDescripcion(producto.getDescripcion());
        productoRequest.setPrecio(producto.getPrecio());
        productoRequest.setTalle(producto.getTalle());
        productoRequest.setStock(producto.getStock());
        return productoRequest;
    }

    @Override
    public ProductoRequest updateProducto(Long productoId, ProductoRequest request) {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Usuario desactivado no puede editar productos");
        }

        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;
        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tenés permiso para editar este producto");
        }

        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del producto no puede estar vacío");
        }
        if (request.getPrecio() == null || request.getPrecio() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El precio no puede ser negativo");
        }
        if (request.getCategoryId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El producto debe tener una categoria asociada");
        }

        Category categoria = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria no encontrada con id: " + request.getCategoryId()));

        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setTalle(request.getTalle());
        producto.setCategoria(categoria);
        productoRepository.save(producto);

        return toResponse(producto);
    }

    @Override
    public void desactivarProducto(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Usuario desactivado no puede desactivar productos");
        }
        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tenés permiso para eliminar este producto");
        }
        if (!producto.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está desactivado");
        }

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public void activarProducto(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

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

        if (producto.getCategoria() != null && !producto.getCategoria().getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede activar un producto cuya categoría está desactivada");
        }

        producto.setActivo(true);
        producto.setDesactivadoPorCategoria(false);
        productoRepository.save(producto);
    }

    @Override
    public void reservarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        int disponible = producto.getStock() - producto.getStockReservado();
        if (cantidad > disponible) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No hay suficiente stock disponible para el producto con id: " + productoId);
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

    @Override
    public Optional<Producto> getProductoEntityById(Long productoId) {
        return productoRepository.findById(productoId);
    }

    @Override
    public List<ProductoRequest> getProductosByPrecio(Double precioMin, Double precioMax) {

        // Validaciones de negocio delegadas al backend
        if (precioMin == null || precioMax == null || precioMin < 0 || precioMax < precioMin) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rango de precios inválido");
        }

        List<Producto> productos = productoRepository.findByPrecioBetween(precioMin, precioMax);

        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductoRequest> buscarProductosPorNombre(String q) {
        if (q == null || q.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<Producto> productos = productoRepository.findByNombreContainingIgnoreCase(q);
        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductoRequest> getProductosByTalle(String talle) {
        
        if (talle == null || talle.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<Producto> productos = productoRepository.findByTalleIgnoreCase(talle);
        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public List<String> getTallesDisponibles() {
        List<Producto> productosConTalle = productoRepository.findDistinctByTalleNotNull();

        if (productosConTalle.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontraron talles disponibles");
        }

        return productosConTalle.stream()
                .map(Producto::getTalle)
                .filter(talle -> talle != null && !talle.isBlank())
                .distinct()
                .toList();
    }

}
