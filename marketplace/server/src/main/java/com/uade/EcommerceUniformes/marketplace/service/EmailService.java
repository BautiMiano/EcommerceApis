package com.uade.EcommerceUniformes.marketplace.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Avisa por mail que un ticket fue respondido.
     * Si el envío falla, solo lo registra en el log: el aviso es un extra
     * y no debe impedir que la respuesta del ticket quede guardada.
     */
    public void enviarRespuestaTicket(String destinatario, String asuntoTicket, String respuesta) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom("bautistamiano@gmail.com");
            mensaje.setTo(destinatario);
            mensaje.setSubject("Respuesta a tu ticket: " + asuntoTicket);
            mensaje.setText(
                    "Hola,\n\n" +
                    "Tu ticket \"" + asuntoTicket + "\" fue respondido:\n\n" +
                    respuesta +
                    "\n\nSaludos,\nEquipo de UNIFORMA");

            mailSender.send(mensaje);
            log.info("Mail de respuesta enviado para el ticket \"{}\"", asuntoTicket);

        } catch (Exception e) {
            log.warn("No se pudo enviar el mail de respuesta del ticket \"{}\": {}",
                    asuntoTicket, e.getMessage());
        }
    }
}