import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert
} from '@mui/material';
import productService from '../services/product.service';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  category: yup.string().required('Category is required'),
  unitPrice: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be a positive number')
    .required('Price is required'),
  currentStock: yup
    .number()
    .typeError('Stock must be a number')
    .min(0, 'Stock cannot be negative')
    .integer('Stock must be an integer')
    .required('Current stock is required'),
  reorderLevel: yup
    .number()
    .typeError('Reorder level must be a number')
    .min(0, 'Reorder level cannot be negative')
    .integer('Reorder level must be an integer')
    .required('Reorder level is required')
});

const ProductForm = ({ open, handleClose, product, refreshProducts }) => {
  const [apiError, setApiError] = useState('');
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      unitPrice: '',
      currentStock: '',
      reorderLevel: ''
    }
  });

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        name: '',
        sku: '',
        category: '',
        unitPrice: '',
        currentStock: '',
        reorderLevel: ''
      });
    }
  }, [product, reset, open]);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      if (product && product.id) {
        await productService.updateProduct(product.id, data);
      } else {
        await productService.createProduct(data);
      }
      refreshProducts();
      handleClose();
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || err.message || 'An error occurred while saving the product. SKU might already exist.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent dividers>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SKU"
                    fullWidth
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category"
                    fullWidth
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="unitPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Unit Price"
                    type="number"
                    fullWidth
                    error={!!errors.unitPrice}
                    helperText={errors.unitPrice?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="currentStock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Stock"
                    type="number"
                    fullWidth
                    error={!!errors.currentStock}
                    helperText={errors.currentStock?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="reorderLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Reorder Level"
                    type="number"
                    fullWidth
                    error={!!errors.reorderLevel}
                    helperText={errors.reorderLevel?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
