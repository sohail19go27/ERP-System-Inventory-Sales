package com.erp.backend.services;

import com.erp.backend.entity.Product;
import com.erp.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDetails.getName());
        product.setSku(productDetails.getSku());
        product.setCategory(productDetails.getCategory());
        product.setUnitPrice(productDetails.getUnitPrice());
        product.setCurrentStock(productDetails.getCurrentStock());
        product.setReorderLevel(productDetails.getReorderLevel());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public boolean isStockBelowReorderLevel(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return product.getCurrentStock() < product.getReorderLevel();
    }
}
