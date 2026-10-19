package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Favorito;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.FavoritoResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.repository.FavoritoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;

@Service
public class FavoritoServiceImpl implements FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    private ProductoRequest toProductoResponse(Producto producto) {
        ProductoRequest response = new ProductoRequest();
        response.setId(producto.getId());
        response.setNombre(producto.getNombre());
        response.setDescripcion(producto.getDescripcion());
        response.setPrecio(producto.getPrecio());
        response.setTalle(producto.getTalle());
        response.setStock(producto.getStock());
        response.setActivo(producto.isActivo());
        if (producto.getCategoria() != null) {
            response.setCategoryId(producto.getCategoria().getId());
        }
        return response;
    }

    @Override
    public List<FavoritoResponse> getMisFavoritos() {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        // 1. Consulta limpia por ID de usuario
        List<Favorito> favoritos = favoritoRepository.findByUsuarioId(usuarioLogueado.getId());

        return favoritos.stream().map(fav -> {
            FavoritoResponse dto = new FavoritoResponse();
            dto.setId(fav.getId());
            dto.setProducto(toProductoResponse(fav.getProducto()));
            return dto;
        }).toList();
    }

    @Override
    public Favorito agregarFavorito(Long productoId) {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        Optional<Favorito> favoritoExistente = favoritoRepository
                .findByUsuarioIdAndProductoId(usuarioLogueado.getId(), producto.getId());

        // 2. Si ya existe la tupla en la BD, directamente rechaza la petición
        if (favoritoExistente.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está en tus favoritos");
        }

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuarioLogueado);
        favorito.setProducto(producto);

        return favoritoRepository.save(favorito);
    }

    @Override
    public void eliminarFavorito(Long productoId) {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Favorito favorito = favoritoRepository.findByUsuarioIdAndProductoId(usuarioLogueado.getId(), productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El producto no se encuentra en tus favoritos"));

        // 3. Borrado físico directo de la entidad en la base de datos
        favoritoRepository.delete(favorito);
    }
}