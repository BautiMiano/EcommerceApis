package com.uade.EcommerceUniformes.marketplace.controllers;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.uade.EcommerceUniformes.marketplace.entity.Imagen;
import com.uade.EcommerceUniformes.marketplace.entity.Producto;
import com.uade.EcommerceUniformes.marketplace.entity.dto.ImagenResponse;
import com.uade.EcommerceUniformes.marketplace.repository.ProductoRepository;
import com.uade.EcommerceUniformes.marketplace.service.ImagenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/imagenes")
@RequiredArgsConstructor
public class ImagenController {

    private final ImagenService imagenService;
    private final ProductoRepository productoRepository;

    @PostMapping
    public String addImagePost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productoId") Long productoId)
            throws IOException, SQLException {

        byte[] bytes = file.getBytes();

        Blob blob = new SerialBlob(bytes);

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Imagen imagen = Imagen.builder()
                .imagen(blob)
                .producto(producto)
                .activo(true)
                .build();

        imagenService.createImagen(imagen);

        return "created";
    }

    @GetMapping
    public ResponseEntity<ImagenResponse> displayImage(
            @RequestParam("id") Long id)
            throws SQLException {

        Imagen imagen = imagenService.viewById(id);

        String encodedString = Base64.getEncoder()
                .encodeToString(
                        imagen.getImagen()
                                .getBytes(
                                        1,
                                        (int) imagen.getImagen().length()
                                )
                );

        return ResponseEntity.ok()
                .body(
                        ImagenResponse.builder()
                                .file(encodedString)
                                .id(id)
                                .build()
                );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> desactivarImagen(@PathVariable Long id) {
        imagenService.desactivarImagen(id);
        return ResponseEntity.ok("Imagen desactivada");
    }
}