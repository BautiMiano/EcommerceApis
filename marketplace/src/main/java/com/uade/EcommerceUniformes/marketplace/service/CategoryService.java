package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;


public class CategoryService {

    public ArrayList<Category> getCategories(){
        CategoryRepository categoryRepository = new CategoryRepository();
        categoryRepository.getCategories();
        return categoryRepository.getCategories();
    }

    public String getCategorById(@PathVariable int categoryId){
        return new String();
    }

    public String createCategory(@RequestBody String categoria){
        return categoria;
    }


}
