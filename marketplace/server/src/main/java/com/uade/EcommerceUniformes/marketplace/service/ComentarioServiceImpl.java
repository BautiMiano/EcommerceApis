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
import com.uade.EcommerceUniformes.marketplace.entity.dto.ComentarioResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.PermisoComentarioResponse;

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

    // Una compra cuenta desde que se confirma (hasta que se entrega). Las canceladas no.
    private static final List<EstadoOrden> ESTADOS_COMPRA_VALIDA =
            List.of(EstadoOrden.CONFIRMADA, EstadoOrden.ENVIADA, EstadoOrden.ENTREGADA);

    private boolean compro(Long usuarioId, Long productoId) {
        return itemDeOrdenDeCompraRepository
                .existsByOrden_Usuario_IdAndProducto_IdAndOrden_EstadoIn(usuarioId, productoId, ESTADOS_COMPRA_VALIDA);
    }

    @Override
    public PermisoComentarioResponse puedeComentar(Long productoId) {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        if (!productoRepository.existsById(productoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado con id: " + productoId);
        }
        if (comentarioRepository.existsByUsuario_IdAndProducto_Id(usuarioLogueado.getId(), productoId)) {
            return new PermisoComentarioResponse(false, "Ya dejaste tu reseña de este producto. ¡Gracias!");
        }
        if (!compro(usuarioLogueado.getId(), productoId)) {
            return new PermisoComentarioResponse(false, "Podés dejar tu reseña cuando compres este producto.");
        }
        return new PermisoComentarioResponse(true, null);
    }

    @Override
    public List<Comentario> getComentarios() {

        if (comentarioRepository.findAll().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay comentarios disponibles");
        }
        return comentarioRepository.findAll();
    }

    public ComentarioResponse aResponse(Comentario c) {
        Usuario u = c.getUsuario();
        String nombre = u.getApellido() == null ? u.getNombre() : u.getNombre() + " " + u.getApellido();
        return new ComentarioResponse(c.getId(), c.getComentarioProducto(), c.getCalificacion(), nombre);
    }

    @Override
    public Optional<Comentario> getComentariosById(Long comentarioId) {
        if (!comentarioRepository.existsById(comentarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado con id: " + comentarioId);
        }

        return comentarioRepository.findById(comentarioId);
    }

    @Override
public List<ComentarioResponse> getComentariosByProductoId(Long productoId) {
    if (!productoRepository.existsById(productoId)) {
        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Producto no encontrado con id: " + productoId
        );
    }

    return comentarioRepository.findByProductoId(productoId)
            .stream()
            .map(this::aResponse)
            .toList();
}

    @Override
public ComentarioResponse createComentario(ComentarioRequest request) {

    Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

    Producto producto = productoRepository.findById(request.getProductoId())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Producto no encontrado con id: " + request.getProductoId()
            ));

    boolean compro = compro(usuarioLogueado.getId(), producto.getId());

    if (request.getCalificacion() < 1 || request.getCalificacion() > 5) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La calificación debe ser de 1 a 5 estrellas");
    }

    if (request.getComentarioProducto() == null
            || request.getComentarioProducto().isBlank()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El comentario no puede estar vacío"
        );
    }

    if (!compro) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Solo podés comentar productos que compraste"
        );
    }

    boolean yaComento = comentarioRepository
            .existsByUsuario_IdAndProducto_Id(
                    usuarioLogueado.getId(),
                    producto.getId()
            );

    if (yaComento) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ya dejaste un comentario en este producto"
        );
    }

    Comentario comentario = new Comentario();
    comentario.setUsuario(usuarioLogueado);
    comentario.setComentarioProducto(request.getComentarioProducto().trim());
    comentario.setCalificacion(request.getCalificacion());
    comentario.setProducto(producto);

    return aResponse(comentarioRepository.save(comentario));
}

}
