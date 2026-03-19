package com.erp.backend.controllers;

import com.erp.backend.entity.Invoice;
import com.erp.backend.services.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/invoices")
@Tag(name = "Sales Module", description = "Endpoints for generated invoices and invoice downloads")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT') or hasRole('SALES_EXECUTIVE')")
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT') or hasRole('SALES_EXECUTIVE')")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable Long id) {
        try {
            byte[] pdfBytes = invoiceService.generateInvoicePdf(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
