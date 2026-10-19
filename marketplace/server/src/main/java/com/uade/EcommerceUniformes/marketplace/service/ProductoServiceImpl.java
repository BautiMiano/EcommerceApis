package com.uade.EcommerceUniformes.marketplace.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.Category;
import com.uade.EcommerceUniformes.marketplace.entity.Imagen;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.StockTalle;
import com.uade.EcommerceUniformes.marketplace.entity.Talle;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ProductoRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.TalleStockDto;
import com.uade.EcommerceUniformes.marketplace.repository.CategoryRepository;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import com.uade.EcommerceUniformes.marketplace.repository.StockTalleRepository;
import com.uade.EcommerceUniformes.marketplace.repository.UsuarioRepository;

import io.jsonwebtoken.lang.Collections;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoryRepository categoryRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioLogueadoService usuarioLogueadoService;
    private final StockTalleRepository stockTalleRepository;

    @Override
    public ProductoRequest toResponse(Producto producto) {
        ProductoRequest response = new ProductoRequest();
        response.setId(producto.getId());

        if (producto.getCategoria() != null) {
            response.setCategoryId(producto.getCategoria().getId());
        }

        response.setNombre(producto.getNombre());
        response.setDescripcion(producto.getDescripcion());
        response.setSku(producto.getSku());
        response.setMarca(producto.getMarca());
        response.setPrecio(producto.getPrecio());
        response.setTalles(producto.getTalles().stream()
                .sorted(Comparator.comparing(StockTalle::getTalle))
                .map(t -> new TalleStockDto(t.getTalle(), t.getStock(), t.getStockReservado()))
                .toList());
        response.setStock(producto.getStockTotal());
        response.setActivo(producto.isActivo());
        response.setEstado(producto.getEstado());
        response.setVendedorId(producto.getVendedor().getId());
        response.setVendedor(producto.getVendedor().getNombreUsuario());

        if (producto.getCategoria() != null) {
            response.setCategoria(producto.getCategoria().getNombre());
        }

        if (producto.getDescuento() != null) {
            response.setDescuentoId(producto.getDescuento().getIdDescuento());
            response.setDescuentoPorcentaje(producto.getDescuento().getPorcentaje());
            response.setDescuentoAplicadoPorAdmin(producto.isDescuentoAplicadoPorAdmin());
        }

        if (producto.getImagenes() != null) {
            // Se arman juntas las dos listas para que cada imagen quede alineada con su id
            List<String> imagenesBase64 = new ArrayList<>();
            List<Long> imagenIds = new ArrayList<>();

            for (Imagen img : producto.getImagenes()) {
                if (!Boolean.TRUE.equals(img.getActivo()) || img.getImagen() == null) {
                    continue;
                }
                try {
                    byte[] bytes = img.getImagen().getBytes(1, (int) img.getImagen().length());
                    String tipoContenido = img.getTipoContenido() == null
                            ? "application/octet-stream"
                            : img.getTipoContenido();
                    imagenesBase64.add("data:" + tipoContenido + ";base64,"
                            + Base64.getEncoder().encodeToString(bytes));
                    imagenIds.add(img.getId());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            response.setImagenes(imagenesBase64);
            response.setImagenIds(imagenIds);
        }

        return response;
    }

    @Override
    public List<ProductoRequest> getProductos() {

        List<Producto> productos = productoRepository.findAll();

        if (productos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay productos disponibles");
        }

        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public ProductoRequest getProductoById(Long productoId) {

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        return toResponse(producto);
    }

    @Override
    public List<ProductoRequest> getProductosByCategoria(Long categoriaId) {

        if (!categoryRepository.existsById(categoriaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria no encontrada con id: " + categoriaId);
        }

        List<Producto> productos = productoRepository.findByCategoriaId(categoriaId);

        return productos.stream().map(this::toResponse).toList();
    }

    public List<ProductoRequest> getMisProductos() {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        List<Producto> productos = productoRepository.findByVendedorId(usuarioLogueado.getId());

        if (productos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No hay productos disponibles para el vendedor con id: " + usuarioLogueado.getId());
        }

        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public ProductoRequest createProducto(ProductoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        if (usuarioLogueado.getRolUsuario() != Rol.VENDEDOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo los usuarios vendedores pueden crear productos");
        }

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "El usuario vendedor está desactivado y no puede crear productos");
        }

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setSku(textoOpcional(request.getSku()));
        producto.setMarca(textoOpcional(request.getMarca()));
        producto.setPrecio(request.getPrecio());
        producto.setEstado(request.getEstado());
        producto.setVendedor(usuarioLogueado);

        validarTalles(request.getTalles());
        for (TalleStockDto talle : request.getTalles()) {
            producto.getTalles().add(new StockTalle(producto, talle.getTalle(), talle.getStock()));
        }

        if (request.getCategoryId() != null) {
            Category categoria = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Categoria no encontrada con id: " + request.getCategoryId()));
            producto.setCategoria(categoria);
        }

        if (producto.getCategoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto debe tener una categoria asociada");
        }

        if (producto.getPrecio() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio no puede ser negativo");
        }

        if (producto.getNombre() == null || producto.getNombre().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del producto no puede estar vacío");
        }

        productoRepository.save(producto);

        return toResponse(producto);
    }

    /** Al menos un talle, sin repetidos, stock no negativo, y UNICO no se combina con otros. */
    private void validarTalles(List<TalleStockDto> talles) {
        if (talles == null || talles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto debe tener al menos un talle");
        }

        Set<Talle> vistos = EnumSet.noneOf(Talle.class);
        for (TalleStockDto talle : talles) {
            if (talle.getTalle() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Cada talle debe ser S, M, L, XL, XXL o UNICO");
            }
            if (!vistos.add(talle.getTalle())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El talle " + talle.getTalle() + " está repetido");
            }
            if (talle.getStock() == null || talle.getStock() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El stock del talle " + talle.getTalle() + " no puede ser negativo");
            }
        }

        if (vistos.contains(Talle.UNICO) && vistos.size() > 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El talle UNICO no se puede combinar con otros talles");
        }
    }

    /** Deja el producto con exactamente los talles recibidos, sin perder stock reservado. */
    private void sincronizarTalles(Producto producto, List<TalleStockDto> talles) {
        validarTalles(talles);

        Set<Talle> recibidos = talles.stream().map(TalleStockDto::getTalle)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(Talle.class)));

        for (StockTalle existente : producto.getTalles()) {
            if (!recibidos.contains(existente.getTalle()) && existente.getStockReservado() > 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "No se puede quitar el talle " + existente.getTalle() + " porque tiene stock reservado");
            }
        }
        producto.getTalles().removeIf(existente -> !recibidos.contains(existente.getTalle()));

        for (TalleStockDto talle : talles) {
            Optional<StockTalle> existente = producto.buscarTalle(talle.getTalle());

            if (existente.isPresent()) {
                if (talle.getStock() < existente.get().getStockReservado()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "El stock del talle " + talle.getTalle() + " no puede ser menor al reservado ("
                                    + existente.get().getStockReservado() + ")");
                }
                existente.get().setStock(talle.getStock());
            } else {
                producto.getTalles().add(new StockTalle(producto, talle.getTalle(), talle.getStock()));
            }
        }
    }

    // Guarda null en lugar de textos vacíos para los campos opcionales
    private String textoOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private StockTalle obtenerStockTalle(Producto producto, Talle talle) {
        return producto.buscarTalle(talle)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El producto " + producto.getNombre() + " no tiene el talle " + talle));
    }

    @Override
    public ProductoRequest updateProducto(Long productoId, ProductoRequest request) {
        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Usuario desactivado no puede editar productos");
        }

        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;
        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tenés permiso para editar este producto");
        }

        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del producto no puede estar vacío");
        }
        if (request.getPrecio() == null || request.getPrecio() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El precio no puede ser negativo");
        }
        if (request.getCategoryId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El producto debe tener una categoria asociada");
        }

        Category categoria = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria no encontrada con id: " + request.getCategoryId()));

        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(request.getDescripcion());
        producto.setSku(textoOpcional(request.getSku()));
        producto.setMarca(textoOpcional(request.getMarca()));
        producto.setPrecio(request.getPrecio());
        producto.setCategoria(categoria);

        if (request.getTalles() != null) {
            sincronizarTalles(producto, request.getTalles());
        }
        productoRepository.save(producto);

        return toResponse(producto);
    }

    @Override
    public void desactivarProducto(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Usuario desactivado no puede desactivar productos");
        }
        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tenés permiso para eliminar este producto");
        }
        if (!producto.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está desactivado");
        }

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public void activarProducto(Long productoId) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + productoId));

        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());
        boolean esAdmin = usuarioLogueado.getRolUsuario() == Rol.ADMIN;

        if (!esDueño && !esAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tenés permiso para activar este producto");
        }

        if (!usuarioLogueado.isActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario desactivado no puede activar productos");
        }

        if (producto.isActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto ya está activo");
        }

        if (producto.getCategoria() != null && !producto.getCategoria().getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede activar un producto cuya categoría está desactivada");
        }

        producto.setActivo(true);
        producto.setDesactivadoPorCategoria(false);
        productoRepository.save(producto);
    }

    @Override
    public void reservarStock(Long productoId, Talle talle, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        StockTalle stockTalle = obtenerStockTalle(producto, talle);
        if (cantidad > stockTalle.getStockDisponible()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No hay suficiente stock disponible de " + producto.getNombre() + " en talle " + talle);
        }
        stockTalle.setStockReservado(stockTalle.getStockReservado() + cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void liberarStock(Long productoId, Talle talle, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        StockTalle stockTalle = obtenerStockTalle(producto, talle);
        stockTalle.setStockReservado(stockTalle.getStockReservado() - cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void descontarStockDefinitivo(Long productoId, Talle talle, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        StockTalle stockTalle = obtenerStockTalle(producto, talle);
        stockTalle.setStock(stockTalle.getStock() - cantidad);
        stockTalle.setStockReservado(stockTalle.getStockReservado() - cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void devolverStock(Long productoId, Talle talle, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        StockTalle stockTalle = obtenerStockTalle(producto, talle);
        stockTalle.setStock(stockTalle.getStock() + cantidad);
        productoRepository.save(producto);
    }

    public void modificarStock(ProductoRequest request) {

        Usuario usuarioLogueado = usuarioLogueadoService.obtenerUsuarioLogueado();

        Producto producto = productoRepository.findById(request.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado con id: " + request.getId()));

        if (usuarioLogueado.getRolUsuario() != Rol.VENDEDOR) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Solo los usuarios vendedores pueden modificar el stock");
        }

        boolean esDueño = producto.getVendedor().getId().equals(usuarioLogueado.getId());

        if (!esDueño) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No se puede modificar el stock de otro vendedor");
        }

        if (request.getTalle() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe indicar el talle al que se le suma stock");
        }

        if (request.getStock() == null || request.getStock() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El stock no puede ser negativo");
        }

        StockTalle stockTalle = obtenerStockTalle(producto, request.getTalle());
        stockTalle.setStock(stockTalle.getStock() + request.getStock());

        productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> getProductoEntityById(Long productoId) {
        return productoRepository.findById(productoId);
    }

    @Override
    public List<ProductoRequest> getProductosByPrecio(Double precioMin, Double precioMax) {

        // Validaciones de negocio delegadas al backend
        if (precioMin == null || precioMax == null || precioMin < 0 || precioMax < precioMin) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rango de precios inválido");
        }

        List<Producto> productos = productoRepository.findByPrecioBetween(precioMin, precioMax);

        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductoRequest> buscarProductosPorNombre(String q) {
        if (q == null || q.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<Producto> productos = productoRepository.findByNombreContainingIgnoreCase(q);
        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductoRequest> getProductosByTalle(String talle) {
        
        if (talle == null || talle.trim().isEmpty()) {
            return Collections.emptyList();
        }

        Talle talleBuscado;
        try {
            talleBuscado = Talle.valueOf(talle.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return Collections.emptyList();
        }

        List<Producto> productos = productoRepository.findDistinctByTalles_Talle(talleBuscado);
        return productos.stream().map(this::toResponse).toList();
    }

    @Override
    public List<String> getTallesDisponibles() {
        List<Talle> talles = stockTalleRepository.findTallesEnUso();

        if (talles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontraron talles disponibles");
        }

        return talles.stream()
                .sorted()
                .map(Talle::name)
                .toList();
    }

}
