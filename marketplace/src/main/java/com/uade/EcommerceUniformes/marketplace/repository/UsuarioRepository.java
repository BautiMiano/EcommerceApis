package com.uade.EcommerceUniformes.marketplace.repository;

import com.uade.EcommerceUniformes.marketplace.entity.Rol;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.Arrays;

public class UsuarioRepository {
    public ArrayList<Usuario> usuarios = new ArrayList<>(
            Arrays.asList(Usuario.builder().id(1).nombreUsuario("BautistaMiano")
                    .nombre("Bautista").apellido("Miano").mail("bautistamiano@gmail.com")
                    .contrasena("Bautista1234").rolUsuario(Rol.VENDEDOR).build(),
                    Usuario.builder().id(2).nombreUsuario("RomanNaviliat")
                            .nombre("Roman").apellido("Naviliat").mail("romannaviliat@gmail.com")
                            .contrasena("roman1234").rolUsuario(Rol.COMPRADOR).build())
    );
    public ArrayList<Usuario> getUsuarios(){
        return this.usuarios;
    }
    public String getUsuarioById(@PathVariable int usuarioId){
        return null;
    }
    public String createUsuario(@RequestBody String usuario){
        return null;
    }
}
