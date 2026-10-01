package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired

    public List<Category> getCategories(){

        return categoryRepository.findAll();
    }

    public Optional<Category> getCategorById(Long categoryId){
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + categoryId);
        }
        return categoryRepository.findById(categoryId);
    }

    public Category createCategory(String nombre){
        List<Category> categories = categoryRepository.findAll();
        if (categories.stream().anyMatch(
                category -> category.getNombre().equals(nombre)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoria que se intenta agregar ya esta creada");
        return categoryRepository.save(new Category(nombre));
    }

@Transactional
public void desactivarCategory(Long id) {
    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Categoria no encontrada con id: " + id
    ));

    if (category.getActivo()==false) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoria con id: " + id + " ya se encuentra desactivada");
    }
    category.setActivo(false);
    categoryRepository.save(category);

    List<Producto> productos = productoRepository.findByCategoriaId(id);
    for (Producto producto : productos) {
        if (producto.isActivo()) {                       // los que ya estaban desactivados no se tocan
            producto.setActivo(false);
            producto.setDesactivadoPorCategoria(true);   // quedan marcados
        }
    }
    productoRepository.saveAll(productos);
}
@Transactional
public void activarCategory(Long id){
    Category category = categoryRepository.findById(id)
    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
        "La categoria con id: "+ id + " no se encuentra"
    ));

    if (category.getActivo()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoria con id: " +  id  + " ya se encuentra activada");
    }
    category.setActivo(true);
    categoryRepository.save(category);

    List<Producto> productos = productoRepository.findByCategoriaId(id);
    for (Producto producto : productos) {
        if (producto.isDesactivadoPorCategoria()) {      // solo los desactivados por la categoría
            producto.setActivo(true);
            producto.setDesactivadoPorCategoria(false);
        }
    }
    productoRepository.saveAll(productos);
}
}
