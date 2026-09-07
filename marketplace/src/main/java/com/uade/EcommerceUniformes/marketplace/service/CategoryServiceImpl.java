package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getCategories(){
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategorById(Long categoryId){
        return categoryRepository.findById(categoryId);
    }

    public Category createCategory(String nombre){
        List<Category> categories = categoryRepository.findAll();
        if (categories.stream().anyMatch(
                category -> category.getNombre().equals(nombre)))
            throw new Error("La categoria que se intenta agregar ya esta creada");
        return categoryRepository.save(new Category(nombre));
    }

    public void desactivarCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                "Categoria no encontrada con id: " + id
        ));

        if (category.getActivo()==false) {
            throw new RuntimeException("La categoria con id: " + id + " ya se encuentra desactivada");
        }
        category.setActivo(false);

        categoryRepository.save(category);
    }

    public void activarCategory(Long id){

        Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException(
            "La categoria con id: "+ id + "no se encuentra"
        ));


        if (category.getActivo()) {
            throw new RuntimeException("La categoria con id: " + id + " ya se encuentra activada");
        }
        category.setActivo(true);    
        categoryRepository.save(category);
        
    }

}
