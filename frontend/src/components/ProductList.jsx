import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import productService from '../services/product.service';
import ProductForm from './ProductForm';
import authService from '../services/auth.service';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = authService.getCurrentUser();
  const isAdminOrManager = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_INVENTORY_MANAGER');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
      setErrorMsg('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product', error);
        setErrorMsg('Failed to delete product.');
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'sku', headerName: 'SKU', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'unitPrice', headerName: 'Price ($)', width: 130, valueFormatter: (params) => `$${params.value?.toFixed(2)}` },
    { 
      field: 'currentStock', 
      headerName: 'Stock', 
      width: 100,
      renderCell: (params) => {
         const isLow = params.value <= (params.row.reorderLevel || 0);
         return (
             <Box sx={{ color: isLow ? 'error.main' : 'inherit', fontWeight: isLow ? 'bold' : 'normal' }}>
                 {params.value}
             </Box>
         );
      }
    },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 130 },
  ];

  if (isAdminOrManager) {
      columns.push({
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => {
          return (
            <Box>
              <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        },
      });
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        {isAdminOrManager && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Product
            </Button>
        )}
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>

      {formOpen && (
          <ProductForm 
            open={formOpen}
            handleClose={() => setFormOpen(false)}
            product={selectedProduct}
            refreshProducts={fetchProducts}
          />
      )}

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')}>
        <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList;
