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

    @Override
    public List<Favorito> getMisFavoritos() {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        return favoritoRepository.findByUsuarioIdAndActivo(usuarioLogueado.getId(), true);
    }

    @Override
    public Favorito agregarFavorito(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        Optional<Favorito> favoritoExistente
                = favoritoRepository.findByUsuarioIdAndProductoId(usuarioLogueado.getId(), producto.getId());

        if (favoritoExistente.isPresent()) {
            Favorito favorito = favoritoExistente.get();

            if (favorito.isActivo()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está en tus favoritos");
            }

            favorito.setActivo(true);
            return favoritoRepository.save(favorito);
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

        if (!favorito.isActivo()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no se encuentra en tus favoritos");
        }

        favorito.setActivo(false);

        favoritoRepository.save(favorito);
    }
}
