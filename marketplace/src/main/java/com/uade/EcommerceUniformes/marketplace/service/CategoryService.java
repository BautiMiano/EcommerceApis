package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Category;

public interface CategoryService {

    public List<Category> getCategories();

    public Optional<Category> getCategorById(Long categoryId);

    public Category createCategory( String nombre);
}
