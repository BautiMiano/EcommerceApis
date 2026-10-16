package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CategoryDto;

public interface CategoryService {

    public List<CategoryDto> getCategories();

    public CategoryDto getCategorById(Long categoryId);

    public CategoryDto createCategory( String nombre);

    public void desactivarCategory(Long id);

    public void activarCategory(Long id);

}
