
package com.uade.EcommerceUniformes.marketplace.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envia un correo cuando se responde un ticket.
     */
    public void enviarRespuestaTicket(
            String destinatario,
            String asuntoTicket,
            String respuesta) {

        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();

            mensaje.setTo(destinatario);
            mensaje.setSubject("Respuesta a tu ticket: " + asuntoTicket);
            mensaje.setText(
                    "Hola,\n\n" +
                    "Tu ticket \"" + asuntoTicket + "\" fue respondido:\n\n" +
                    respuesta +
                    "\n\nSaludos,\nEquipo de UNIFORMA"
            );

            mailSender.send(mensaje);

            log.info("Mail de respuesta enviado para el ticket \"{}\"", asuntoTicket);

        } catch (Exception e) {
            log.warn(
                    "No se pudo enviar el mail del ticket \"{}\": {}",
                    asuntoTicket,
                    e.getMessage()
            );
        }
    }

    /**
     * Envia la orden de compra adjunta en PDF.
     */
    public void enviarOrdenCompra(
            String destinatario,
            Long numeroOrden,
            byte[] pdf) {

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Tu orden de compra #" + numeroOrden + " - UNIFORMA");

            helper.setText(
                    "Hola,\n\n" +
                    "Gracias por comprar en UNIFORMA.\n\n" +
                    "Adjuntamos el PDF de tu orden de compra #" + numeroOrden + ".\n\n" +
                    "Saludos,\n" +
                    "Equipo de UNIFORMA"
            );

            helper.addAttachment(
                    "OrdenDeCompra_" + numeroOrden + ".pdf",
                    new ByteArrayResource(pdf),
                    "application/pdf"
            );

            mailSender.send(mensaje);

            log.info(
                    "Orden de compra {} enviada por correo a {}",
                    numeroOrden,
                    destinatario
            );

        } catch (Exception e) {
            log.error(
                    "No se pudo enviar la orden {} a {}: {}",
                    numeroOrden,
                    destinatario,
                    e.getMessage(),
                    e
            );
        }
    }
}
