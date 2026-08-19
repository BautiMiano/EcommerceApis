package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

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


}
