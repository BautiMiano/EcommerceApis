package com.uade.EcommerceUniformes.marketplace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.service.CategoryService;

@RestController
@RequestMapping("categories")
public class CategoriesController {

    @Autowired
    private CategoryService categoryService;


    @GetMapping
    public List<Category> getCategories() {
        return categoryService.getCategories();
    }

    @GetMapping("/{categoryId}")
    public Optional<Category> getCategorById(@PathVariable Long categoryId){// localhost:4002/categories/id // sirve oara pedir una categoria especifica por su id
        return categoryService.getCategorById(categoryId);
    }

    @PostMapping
    public ResponseEntity<Object> createCategory(@RequestBody Category category){//crea una categoria // localhost:4002/categories
            Category resultado = categoryService.createCategory(category.getNombre());
        return ResponseEntity
                .created(URI.create("/categories/" + resultado.getId()))
                .body(resultado);
    }




}