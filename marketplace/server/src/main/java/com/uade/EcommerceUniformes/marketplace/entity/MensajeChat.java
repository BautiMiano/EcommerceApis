package com.uade.EcommerceUniformes.marketplace.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "conversacion_id")
    private Conversacion conversacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolMensaje rol;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    private LocalDateTime creadoEn;

    /** Ids de los productos que se mostraron como tarjetas con esta respuesta. */
    @ElementCollection
    @CollectionTable(name = "mensaje_chat_productos", joinColumns = @JoinColumn(name = "mensaje_id"))
    @Column(name = "producto_id")
    private List<Long> productoIds = new ArrayList<>();
}