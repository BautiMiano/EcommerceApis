package com.uade.EcommerceUniformes.marketplace.controllers.config;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

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

                // Permisos del administrador
                .requestMatchers("/usuarios/**")
                .hasRole("ADMIN")

                
                
                // Permisos del vendedor
                .requestMatchers(HttpMethod.DELETE, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                                .requestMatchers(HttpMethod.POST, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/productos/**")
                .hasAnyRole("VENDEDOR", "ADMIN")

                //Permiso de todos los usuarios
                .requestMatchers("/productos/**")
                .permitAll()
                .requestMatchers("/ordenesDeCompra/**")
                .authenticated()



                // Permisos del comprador
                .requestMatchers("/carrito/**")      
                .hasAnyRole("COMPRADOR", "VENDEDOR")


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
