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
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/usuarios/**")
                .hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/categories/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/categories/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/imagenes/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,"/usuarios/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/usuarios/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/ordenesDeCompra")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/ordenesDeCompra/*")
                .hasRole("ADMIN")


                .requestMatchers(HttpMethod.GET, "/carritos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/carritos/{carritoId}").hasAnyRole("ADMIN")

                // Permisos del vendedor
                .requestMatchers(HttpMethod.DELETE, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers("/descuentos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/imagenes/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/imagenes/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/productos/*/stock")
                .hasAnyRole("VENDEDOR")

                .requestMatchers(HttpMethod.PATCH, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PATCH,"/imagenes/{id}/activar")
                .hasAnyRole( "ADMIN")

                // Permiso de todos los usuarios
                .requestMatchers(HttpMethod.GET, "/productos/**")
                .permitAll()
                .requestMatchers(HttpMethod.GET, "/categories/**")
                .permitAll()
                .requestMatchers(HttpMethod.GET, "/comentarios/**")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/carritos/**")
                .hasAnyRole("COMPRADOR")
                .requestMatchers(HttpMethod.DELETE,"/carritos/**")
                .hasAnyRole("COMPRADOR")
                .requestMatchers(HttpMethod.GET, "/ordenesDeCompra/mis-ordenes")
                .hasRole("COMPRADOR")
                .requestMatchers(HttpMethod.GET,"/imagenes/**")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/carritos/*/pagar").hasRole("COMPRADOR")
                .requestMatchers(HttpMethod.POST, "/carritos/*/confirmar").hasRole("COMPRADOR")



                .anyRequest().authenticated()
                )
                .sessionManagement(session
                        -> session.sessionCreationPolicy(STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}