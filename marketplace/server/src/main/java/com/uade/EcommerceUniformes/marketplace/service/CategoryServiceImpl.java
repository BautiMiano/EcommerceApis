package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.dto.CategoryDto;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;


@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired

    public List<CategoryDto> getCategories(){

        List<Category> categories = categoryRepository.findAll();

        return categories.stream()
                .map(category -> {
                    CategoryDto response = new CategoryDto();
                    response.setCategoryName(category.getNombre());
                    response.setActivo(category.getActivo());
                    return response;
                })
                .toList();

    }

    public CategoryDto getCategorById(Long categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + categoryId));

        CategoryDto response = new CategoryDto();

        response.setCategoryName(category.getNombre());
        response.setActivo(category.getActivo());

        return response;
    }

public CategoryDto createCategory(String nombre) {

        List<Category> categories = categoryRepository.findAll();

        if (categories.stream().anyMatch(
                category -> category.getNombre().equals(nombre)))
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La categoria que se intenta agregar ya esta creada"
            );

        Category category = new Category();
        category.setNombre(nombre);

        categoryRepository.save(category);

        CategoryDto response = new CategoryDto();

        response.setCategoryName(category.getNombre());

        return response;
    }

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
    }

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
        
    }

}
