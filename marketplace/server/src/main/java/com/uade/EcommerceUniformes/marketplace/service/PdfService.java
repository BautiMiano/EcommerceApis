package com.uade.EcommerceUniformes.marketplace.service;
import java.io.ByteArrayOutputStream;
import org.springframework.stereotype.Service;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.uade.EcommerceUniformes.marketplace.entity.ItemDeOrdenDeCompra;
import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;

@Service
public class PdfService {

    public byte[] generarOrdenPdf(OrdenDeCompra orden) {

        ByteArrayOutputStream salida = new ByteArrayOutputStream();

        Document documento = new Document();

        try {

            PdfWriter.getInstance(documento, salida);

            documento.open();

            documento.add(new Paragraph("UNIFORMA"));
            documento.add(new Paragraph("ORDEN DE COMPRA"));
            documento.add(new Paragraph(" "));

            documento.add(
                    new Paragraph(
                            "Numero de orden: " + orden.getId()
                    )
            );

            documento.add(
                    new Paragraph(
                            "Fecha: " + orden.getFechaCompra()
                    )
            );

            documento.add(
                    new Paragraph(
                            "Cliente: "
                            + orden.getUsuario().getNombre()
                            + " "
                            + orden.getUsuario().getApellido()
                    )
            );

            documento.add(
                    new Paragraph(
                            "Email: "
                            + orden.getUsuario().getMail()
                    )
            );

            documento.add(
                    new Paragraph(
                            "Metodo de pago: "
                            + orden.getMetodoDePago()
                    )
            );

            documento.add(new Paragraph(" "));

            documento.add(new Paragraph("PRODUCTOS"));

            for (ItemDeOrdenDeCompra item : orden.getItems()) {

                documento.add(
                        new Paragraph(
                                item.getProducto().getNombre()
                                + " - Cantidad: "
                                + item.getCantidad()
                                + " - Precio unitario: $"
                                + item.getPrecioUnitario()
                        )
                );
            }

            documento.add(new Paragraph(" "));

            documento.add(
                    new Paragraph(
                            "TOTAL: $" + orden.getTotal()
                    )
            );

            documento.add(
                    new Paragraph(
                            "Estado: " + orden.getEstado()
                    )
            );

            documento.close();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error al generar el PDF de la orden de compra",
                    e
            );
        }

        return salida.toByteArray();
    }
}