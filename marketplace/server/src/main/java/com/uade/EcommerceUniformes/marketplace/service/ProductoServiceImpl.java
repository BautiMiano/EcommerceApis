package com.uade.EcommerceUniformes.marketplace.service;

import java.util.Base64;
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
    public List<ProductoRequest> getProductos() {

        List<Producto> productos = productoRepository.findAll();

        if (productos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay productos disponibles");
        }

        return productos.stream()
                .map(producto -> {
                    ProductoRequest response = new ProductoRequest();
                    response.setNombre(producto.getNombre());
                    response.setDescripcion(producto.getDescripcion());
                    response.setPrecio(producto.getPrecio());
                    response.setTalle(producto.getTalle());
                    response.setStock(producto.getStock());

                    return response;
                })

                .toList();
    }

    @Override
    public ProductoRequest getProductoById(Long productoId) {
        
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay producto creados actualmente "));

        productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId));
       

        ProductoRequest productoRequest = new ProductoRequest();

        productoRequest.setNombre(producto.getNombre());
        productoRequest.setDescripcion(producto.getDescripcion());
        productoRequest.setPrecio(producto.getPrecio());
        productoRequest.setTalle(producto.getTalle());
        productoRequest.setStock(producto.getStock());

        return productoRequest;
    }

    @Override
    public List<ProductoRequest> getProductosByCategoria(Long categoriaId) {
        if (!categoryRepository.existsById(categoriaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + categoriaId);
        }

        
        List<Producto> productos = productoRepository.findByCategoriaId(categoriaId);
        if (productos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay productos disponibles para la categoria con id: " + categoriaId);
        }
        
        return productos.stream()
            .map(producto -> {

                ProductoRequest productoRequest = new ProductoRequest();

                productoRequest.setCategoryId(categoriaId);
                productoRequest.setNombre(producto.getNombre());
                productoRequest.setDescripcion(producto.getDescripcion());
                productoRequest.setPrecio(producto.getPrecio());
                productoRequest.setTalle(producto.getTalle());
                productoRequest.setStock(producto.getStock());

                if (producto.getImagenes() != null) {
                    List<String> imagenes = producto.getImagenes().stream()
                        .map(imagen -> {
                            try {
                                byte[] bytes = imagen.getImagen().getBytes(1, (int) imagen.getImagen().length());
                                return Base64.getEncoder().encodeToString(bytes);
                            } catch (Exception e) {
                                return null;
                            }
                        })
                        .toList();

                    productoRequest.setImagenes(imagenes);
                }

                return productoRequest;
            })
            .toList();
    }

    @Override
    public ProductoRequest createProducto(ProductoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        

        if (usuarioLogueado.getRolUsuario() != Rol.VENDEDOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los usuarios vendedores pueden crear productos");
        }

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El usuario vendedor está desactivado y no puede crear productos");
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
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + request.getCategoryId()));
            producto.setCategoria(categoria);
        }

        if (producto.getCategoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto debe tener una categoria asociada");
        }

        if (producto.getStock() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo");
        }

        if(producto.getPrecio() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio no puede ser negativo");
        }

        if (producto.getNombre() == null || producto.getNombre().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del producto no puede estar vacío");
        }

        productoRepository.save(producto);

        ProductoRequest productoRequest = new ProductoRequest();
        productoRequest.setNombre(producto.getNombre());
        productoRequest.setDescripcion(producto.getDescripcion());
        productoRequest.setPrecio(producto.getPrecio());
        productoRequest.setTalle(producto.getTalle());
        productoRequest.setStock(producto.getStock());
        return productoRequest;
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


    public List<ProductoRequest> getMisProductos() {

    Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

    List<Producto> productos =
            productoRepository.findByVendedorId(usuarioLogueado.getId());

    if (productos.isEmpty()) {
        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No hay productos disponibles para el vendedor con id: "
                        + usuarioLogueado.getId()
        );
    }

    return productos.stream()
            .map(producto -> {

                ProductoRequest response = new ProductoRequest();

                response.setNombre(producto.getNombre());
                response.setDescripcion(producto.getDescripcion());
                response.setPrecio(producto.getPrecio());
                response.setTalle(producto.getTalle());
                response.setStock(producto.getStock());
                response.setActivo(producto.isActivo());
                
                if(producto.getImagenes()!= null){
                     List<String> imagenes = producto.getImagenes().stream()
                            .map(imagen -> {

                                try {
                                    byte[] bytes = imagen.getImagen()
                                            .getBytes(1, (int) imagen.getImagen().length());

                                    return Base64.getEncoder().encodeToString(bytes);

                                } catch (Exception e) {
                                    return null;
                                }

                            })
                            .toList();

                    response.setImagenes(imagenes);
                    }
                

                return response;
            })
            .toList();
    }
    
    
    @Override 
    public Optional<Producto> getProductoEntityById(Long productoId) {  
    return productoRepository.findById(productoId);
}
    
}
