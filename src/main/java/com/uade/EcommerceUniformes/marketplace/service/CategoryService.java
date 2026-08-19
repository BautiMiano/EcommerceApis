package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    public List<Category> getCategories();

    public Optional<Category> getCategorById(Long categoryId);

    public Category createCategory( String nombre);
}
