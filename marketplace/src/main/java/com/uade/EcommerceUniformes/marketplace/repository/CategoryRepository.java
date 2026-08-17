package com.uade.EcommerceUniformes.marketplace.repository;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.Arrays;

public class CategoryRepository {

    public ArrayList<Category> categories = new ArrayList<Category>(
            Arrays.asList(Category.builder().nombre("Gastronomia").id(1).build(),
                Category.builder().nombre("Salud").id(2).build(),
                Category.builder().nombre("Industria y Mantenimiento").id(3).build(),
                Category.builder().nombre("Construccion").id(4).build(),
                Category.builder().nombre("Seguridad").id(5).build(),
                Category.builder().nombre("Reparto y Logistica").id(6).build())
            );

    public ArrayList<Category> getCategories(){
        return this.categories;
    }

    public String getCategorById(@PathVariable int categoryId){
        return null;
    }

    public String createCategory(@RequestBody String categoria){
        return null;    }
}
