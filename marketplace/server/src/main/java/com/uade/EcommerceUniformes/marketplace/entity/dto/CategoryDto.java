package com.uade.EcommerceUniformes.marketplace.entity.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryDto {
    @JsonProperty("idCategoria")
    private Long categoryId;

    @JsonProperty("nombreCategoria")
    private String categoryName;

    @JsonProperty("activo")
    private Boolean activo;
}
