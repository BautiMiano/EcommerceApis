package com.uade.EcommerceUniformes.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarRespuestaTicket(
        String destinatario,
        String asuntoTicket,
        String respuesta) {

    try {

        System.out.println("DESTINATARIO: " + destinatario);

        SimpleMailMessage mensaje = new SimpleMailMessage();

        mensaje.setFrom("bautistamiano@gmail.com");
        mensaje.setTo(destinatario);
        mensaje.setSubject("Respuesta a tu ticket: " + asuntoTicket);

        mensaje.setText(
                "Hola,\n\n" +
                "Tu ticket \"" + asuntoTicket + "\" fue respondido:\n\n" +
                respuesta +
                "\n\nSaludos,\nEquipo de UNIFORMA"
        );

        mailSender.send(mensaje);

        System.out.println("MAIL ENVIADO CORRECTAMENTE");

    } catch (Exception e) {

        System.out.println("ERROR AL ENVIAR MAIL:");
        e.printStackTrace();

        throw new RuntimeException(
                "Error al enviar el email: " + e.getMessage());
    }
}
}