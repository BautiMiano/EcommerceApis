package com.uade.EcommerceUniformes.marketplace.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                        // Permitir peticiones pre-flight OPTIONS globales (necesario para CORS con autenticación)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Publicos
                        .requestMatchers("/auth/**", "/error").permitAll()

                        // Perfil propio (ANTES de la regla de admin de GET /usuarios/**)
                        .requestMatchers(HttpMethod.GET, "/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/me/contrasena").authenticated()

                        // Usuarios (solo admin)
                        .requestMatchers(HttpMethod.GET, "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").hasRole("ADMIN")

                        // Categorias (Soporta /categories y /categorias)
                        .requestMatchers(HttpMethod.POST, "/categories/**", "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/categories/**", "/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/categories/todas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/categories/**", "/categorias/**").permitAll()

                        // Ordenes
                        .requestMatchers(HttpMethod.GET, "/ordenesDeCompra/mis-ordenes").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.GET, "/ordenesDeCompra/mis-ordenes/*").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.GET, "/ordenesDeCompra/mis-ventas", "/ordenesDeCompra/mis-ventas/*").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.PATCH, "/ordenesDeCompra/mis-ventas/*/estado").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/ordenesDeCompra").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/ordenesDeCompra/*").hasRole("ADMIN")

                        // Carritos (el orden importa: lo mas especifico primero)
                        .requestMatchers(HttpMethod.GET, "/carritos/usuario/*").hasAnyRole("COMPRADOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/carritos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/carritos/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/carritos/*/pagar").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.POST, "/carritos/*/confirmar").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.POST, "/carritos/**").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.PUT, "/carritos/**").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/carritos/**").hasRole("COMPRADOR")

                        // Productos (mis-productos ANTES del permitAll de GET /productos/**)
                        .requestMatchers(HttpMethod.GET, "/productos/mis-productos").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos/talle/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos/talles/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/productos/**").hasAnyRole("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/productos/**").hasAnyRole("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/productos/stock").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.PATCH, "/productos/desactivar/*").hasAnyRole("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/productos/activar/*").hasAnyRole("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/producto/{productoId}").hasAnyRole("VENDEDOR", "ADMIN")

                        // Descuentos
                        .requestMatchers(HttpMethod.GET, "/descuentos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/descuentos/**").hasAnyRole("VENDEDOR", "ADMIN")

                        // Imagenes
                        .requestMatchers(HttpMethod.GET, "/imagenes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/imagenes/**").hasAnyRole("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/imagenes/**").hasAnyRole("VENDEDOR", "ADMIN")

                        // Tickets
                        .requestMatchers(HttpMethod.POST, "/tickets").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/tickets/mis-tickets").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/tickets/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/tickets/**").hasRole("ADMIN")

                        // Comentarios y favoritos
                        .requestMatchers(HttpMethod.GET, "/comentarios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/favoritos/mis-favoritos").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.POST, "/favoritos/*").hasRole("COMPRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/favoritos/*").hasRole("COMPRADOR")

                        // Chat
                        .requestMatchers("/chat", "/chat/**").hasAnyRole("COMPRADOR", "VENDEDOR")

                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
