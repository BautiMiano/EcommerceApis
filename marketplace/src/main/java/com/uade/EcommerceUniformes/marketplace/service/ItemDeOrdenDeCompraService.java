package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;

public interface ItemDeOrdenDeCompraService {
    public List<ItemDeOrdenDeCompra> getItemsByOrdenId(Long ordenId);
    public Optional<ItemDeOrdenDeCompra> getItemById(Long itemId);
}