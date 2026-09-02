package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.repository.ItemDeOrdenDeCompraRepository;

@Service
public class ItemDeOrdenDeCompraServiceImpl implements ItemDeOrdenDeCompraService {
    @Autowired
    private ItemDeOrdenDeCompraRepository itemDeOrdenDeCompraRepository;

    public List<ItemDeOrdenDeCompra> getItemsByOrdenId(Long ordenId) {
        return itemDeOrdenDeCompraRepository.findByOrdenId(ordenId);
    }

    public Optional<ItemDeOrdenDeCompra> getItemById(Long itemId) {
        return itemDeOrdenDeCompraRepository.findById(itemId);
    }
}