package com.erp.backend.services;

import com.erp.backend.entity.Invoice;
import com.erp.backend.entity.SalesOrder;
import com.erp.backend.entity.SalesOrderItem;
import com.erp.backend.repository.InvoiceRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.Date;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Transactional
    public Invoice generateInvoiceFromSalesOrder(SalesOrder order) {
        // Calculate 18% GST text sum
        double totalAmount = order.getTotalAmount();
        double taxAmount = totalAmount * 0.18;
        double totalPayable = totalAmount + taxAmount;

        Invoice invoice = new Invoice();
        invoice.setCustomer(order.getCustomer());
        invoice.setSalesOrder(order);
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalPayable(totalPayable);
        invoice.setStatus("Unpaid");
        invoice.setCreationDate(new Date());

        return invoiceRepository.save(invoice);
    }

    public byte[] generateInvoicePdf(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        SalesOrder order = invoice.getSalesOrder();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph("INVOICE"));
            document.add(new Paragraph("Invoice ID: " + invoice.getId()));
            document.add(new Paragraph("Date: " + invoice.getCreationDate().toString()));
            document.add(new Paragraph("--------------------------------------------------"));

            document.add(new Paragraph("Customer: " + invoice.getCustomer().getName()));
            document.add(new Paragraph("Email: " + invoice.getCustomer().getEmail()));
            document.add(new Paragraph("Phone: " + invoice.getCustomer().getPhone()));
            if(invoice.getCustomer().getGstin() != null && !invoice.getCustomer().getGstin().isEmpty()) {
                document.add(new Paragraph("GSTIN: " + invoice.getCustomer().getGstin()));
            }
            document.add(new Paragraph("--------------------------------------------------"));
            
            document.add(new Paragraph("Order Details (Order ID: " + order.getId() + ")"));
            for (SalesOrderItem item : order.getItems()) {
                document.add(new Paragraph(
                        item.getProduct().getName() + " x " + item.getQuantity() + 
                        " - $" + String.format("%.2f", item.getQuantity() * item.getUnitPrice())
                ));
            }
            document.add(new Paragraph("--------------------------------------------------"));
            
            document.add(new Paragraph("Subtotal: $" + String.format("%.2f", order.getTotalAmount())));
            document.add(new Paragraph("Tax (18% GST): $" + String.format("%.2f", invoice.getTaxAmount())));
            document.add(new Paragraph("Total Payable: $" + String.format("%.2f", invoice.getTotalPayable())));
            document.add(new Paragraph("Status: " + invoice.getStatus()));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate PDF for Invoice");
        }
    }
}
