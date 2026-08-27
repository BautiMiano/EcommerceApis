package com.uade.EcommerceUniformes.marketplace.service;

import com.uade.EcommerceUniformes.marketplace.entity.Descuento;
import com.uade.EcommerceUniformes.marketplace.repository.DescuentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DescuentoServiceImpl implements DescuentoService {
    @Autowired
    private DescuentoRepository descuentoRepository;

    public List<Descuento> getDescuentos() {
        return descuentoRepository.findAll();
    }

    public Optional<Descuento> getDescuentoById(Long descuentoId) {
        return descuentoRepository.findById(descuentoId);
    }

    public Descuento createDescuento(double porcentaje) {
        if (porcentaje <= 0 || porcentaje > 100)
            throw new Error("El porcentaje de descuento debe ser mayor a 0 y menor o igual a 100");

        Descuento descuento = new Descuento();
        descuento.setPorcentaje(porcentaje);
        return descuentoRepository.save(descuento);
    }
}