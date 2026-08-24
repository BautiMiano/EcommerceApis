package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    private final CategoryRepository categoryRepository;

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

        System.out.println("CATEGORY ID RECIBIDO: " + request.getCategoryId());

        Producto producto = new Producto();

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setTalle(request.getTalle());
        producto.setStock(request.getStock());
        producto.setImagen(request.getImagen());
        producto.setEstado(request.getEstado());

        if (request.getCategoryId() != null) {

            Category categoria = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException(
                    "Categoria no encontrada con id: " + request.getCategoryId()
            ));

            System.out.println("CATEGORIA ENCONTRADA: " + categoria.getNombre());

            producto.setCategoria(categoria);
        }

        return productoRepository.save(producto);
    }

    public void deleteProducto(Long productoId) {
        Producto producto = productoRepository.findById(productoId).orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));
        productoRepository.delete(producto);

    }

}
