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

    @Override
    public List<Comentario> getComentarios() {
        return comentarioRepository.findAll();
    }

    @Override
    public Optional<Comentario> getComentariosById(Long comentarioId) {
        return comentarioRepository.findById(comentarioId);
    }

    @Override
    public List<Comentario> getComentariosByProductoId(Long productoId) {
        return comentarioRepository.findByProductoId(productoId);
    }

    public Comentario createComentario(ComentarioRequest request) {

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException(
                        "Producto no encontrado con id: " + request.getProductoId()));

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado con id: " + request.getUsuarioId()));

        boolean compro = itemDeOrdenDeCompraRepository
                .existsByOrden_Usuario_IdAndProducto_IdAndOrden_Estado(
                        usuario.getId(), producto.getId(), EstadoOrden.CONFIRMADA); // ajustar nombre

        if (!compro) {
            throw new RuntimeException("Solo podés comentar productos que compraste");
        }

        boolean yaComento = comentarioRepository
                .existsByUsuario_IdAndProducto_Id(usuario.getId(), producto.getId());

        if (yaComento) {
            throw new RuntimeException("Ya dejaste un comentario en este producto");
        }

        Comentario comentario = new Comentario();
        comentario.setUsuario(usuario);
        comentario.setComentarioProducto(request.getComentarioProducto());
        comentario.setCalificacion(request.getCalificacion());
        comentario.setProducto(producto);

        return comentarioRepository.save(comentario);
    }

    

}
