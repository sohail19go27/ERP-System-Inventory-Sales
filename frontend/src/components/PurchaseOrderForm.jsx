import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Alert,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import purchaseOrderService from '../services/purchaseorder.service';
import supplierService from '../services/supplier.service';
import productService from '../services/product.service';

const schema = yup.object().shape({
  supplierId: yup.number().required('Supplier is required').typeError('Supplier must be selected'),
  expectedDeliveryDate: yup.date().required('Expected delivery date is required').typeError('Invalid date'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.number().required('Product is required').typeError('Product is required'),
        quantity: yup.number().required('Quantity is required').min(1, 'At least 1 item is required').typeError('Quantity must be a number'),
      })
    )
    .min(1, 'Order must contain at least one item')
});

const PurchaseOrderForm = ({ open, handleClose, refreshOrders }) => {
  const [apiError, setApiError] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      supplierId: '',
      expectedDeliveryDate: '',
      items: [{ productId: '', quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  useEffect(() => {
    if (open) {
      reset({ supplierId: '', expectedDeliveryDate: '', items: [{ productId: '', quantity: 1 }] });
      fetchData();
    }
  }, [open, reset]);

  const fetchData = async () => {
    try {
      const [suppliersRes, productsRes] = await Promise.all([
        supplierService.getAllSuppliers(),
        productService.getAllProducts()
      ]);
      setSuppliers(suppliersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch initial data', err);
      setApiError('Could not load base data. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await purchaseOrderService.createPurchaseOrder(data);
      refreshOrders();
      handleClose();
    } catch (err) {
      console.error(err);
      setApiError('An error occurred while creating the purchase order.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create New Purchase Order</DialogTitle>
        <DialogContent dividers>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Supplier"
                    fullWidth
                    error={!!errors.supplierId}
                    helperText={errors.supplierId?.message}
                  >
                    <MenuItem value=""><em>Select Supplier</em></MenuItem>
                    {suppliers.map((s) => (
                      <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="expectedDeliveryDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expected Delivery"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.expectedDeliveryDate}
                    helperText={errors.expectedDeliveryDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6">Order Items</Typography>
                <Button startIcon={<AddIcon />} variant="outlined" onClick={() => append({ productId: '', quantity: 1 })}>
                  Add Item
                </Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              {errors.items && typeof errors.items.message === 'string' && (
                  <Alert severity="error" sx={{ mb: 2 }}>{errors.items.message}</Alert>
              )}
            </Grid>

            {fields.map((item, index) => (
              <React.Fragment key={item.id}>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name={`items.${index}.productId`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Product"
                        fullWidth
                        error={!!errors.items?.[index]?.productId}
                        helperText={errors.items?.[index]?.productId?.message}
                      >
                         <MenuItem value=""><em>Select Product</em></MenuItem>
                        {products.map((p) => (
                          <MenuItem key={p.id} value={p.id}>{p.name} - ${p.unitPrice?.toFixed(2)} (Stock: {p.currentStock})</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={10} sm={4}>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quantity"
                        type="number"
                        fullWidth
                        error={!!errors.items?.[index]?.quantity}
                        helperText={errors.items?.[index]?.quantity?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PurchaseOrderForm;
