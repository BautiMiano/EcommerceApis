package com.uade.EcommerceUniformes.marketplace.service.chat;

import com.uade.EcommerceUniformes.marketplace.entity.Usuario;

/**
 * Con qué tipo de usuario está hablando el bot.
 */
public enum RolChat {
    COMPRADOR,
    VENDEDOR;

    /** Lee el rol de los permisos de Spring Security del usuario (ROLE_COMPRADOR, ROLE_VENDEDOR). */
    public static RolChat de(Usuario usuario) {
        boolean esVendedor = usuario.getAuthorities().stream()
                .anyMatch(permiso -> permiso.getAuthority().equals("ROLE_VENDEDOR"));
        return esVendedor ? VENDEDOR : COMPRADOR;
    }
}