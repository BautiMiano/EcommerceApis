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
                .requestMatchers(HttpMethod.GET,"/usuarios/**")
                .hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.POST,"/categories/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/categories/**")
                .hasRole("ADMIN")//patch

                
                
                // Permisos del vendedor
                .requestMatchers(HttpMethod.DELETE, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")// patch 
                .requestMatchers(HttpMethod.POST, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")// solo sus productos
                .requestMatchers("/descuentos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")

                //Permiso de todos los usuarios
                .requestMatchers(HttpMethod.GET, "/productos/**")
                .permitAll()
                .requestMatchers("/ordenesDeCompra/**")
                .authenticated()// comprador: get de sus propias ordenes/ vendedor: get de sus ordenes, que no se autocompre / admin: todas
                .requestMatchers("/categories/**")
                .permitAll()
                .requestMatchers("/comentarios/**")
                .permitAll()// get permitAll. post logica de comprar el prod comprador y vendedor. verificar si compro y que deje 1 solo comentario


                // Permisos del comprador
                .requestMatchers("/carrito/**")      
                .hasAnyRole("COMPRADOR")//comprador.
                


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
