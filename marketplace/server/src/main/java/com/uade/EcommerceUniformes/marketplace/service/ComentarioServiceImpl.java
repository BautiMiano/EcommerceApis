package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.EcommerceUniformes.marketplace.entity.Comentario;
import com.uade.EcommerceUniformes.marketplace.entity.EstadoOrden;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ComentarioRequest;
import com.uade.EcommerceUniformes.marketplace.repository.ComentarioRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ItemDeOrdenDeCompraRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.uade.EcommerceUniformes.marketplace.service.UsuarioLogueadoService;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ItemDeOrdenDeCompraRepository itemDeOrdenDeCompraRepository;

    @Autowired
    private UsuarioLogueadoService usuarioLogueadoService;

    @Override
    public List<Comentario> getComentarios() {

        if (comentarioRepository.findAll().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay comentarios disponibles");
        }
        return comentarioRepository.findAll();
    }

    @Override
    public Optional<Comentario> getComentariosById(Long comentarioId) {
        if (!comentarioRepository.existsById(comentarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado con id: " + comentarioId);
        }

        return comentarioRepository.findById(comentarioId);
    }

    @Override
    public List<Comentario> getComentariosByProductoId(Long productoId) {

        if (!productoRepository.existsById(productoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId);
        }
        return comentarioRepository.findByProductoId(productoId);
    }

    public Comentario createComentario(ComentarioRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + request.getProductoId()));


        boolean compro = itemDeOrdenDeCompraRepository
                .existsByOrden_Usuario_IdAndProducto_IdAndOrden_Estado(
                        usuarioLogueado.getId(), producto.getId(), EstadoOrden.CONFIRMADA);

        if (!compro) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo podés comentar productos que compraste");
        }

        boolean yaComento = comentarioRepository
                .existsByUsuario_IdAndProducto_Id(usuarioLogueado.getId(), producto.getId());

        if (yaComento) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya dejaste un comentario en este producto");
        }

        Comentario comentario = new Comentario();
        comentario.setUsuario(usuarioLogueado);
        comentario.setComentarioProducto(request.getComentarioProducto());
        comentario.setCalificacion(request.getCalificacion());
        comentario.setProducto(producto);

        return comentarioRepository.save(comentario);
    }

    

}
