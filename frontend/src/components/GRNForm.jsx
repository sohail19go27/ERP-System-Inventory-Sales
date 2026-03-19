import React, { useState, useEffect } from 'react';
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
  Alert,
  Typography,
  Box,
  Divider
} from '@mui/material';
import grnService from '../services/grn.service';

const schema = yup.object().shape({
  remarks: yup.string()
});

const GRNForm = ({ open, handleClose, purchaseOrder, refreshOrders }) => {
  const [apiError, setApiError] = useState('');

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      remarks: ''
    }
  });

  useEffect(() => {
    if (open) {
      reset({ remarks: '' });
      setApiError('');
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await grnService.createGRN({
        purchaseOrderId: purchaseOrder.id,
        remarks: data.remarks
      });
      refreshOrders();
      handleClose();
    } catch (err) {
      console.error(err);
      setApiError('Failed to generate GRN. Make sure the Purchase Order is in "Ordered" status.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Receive Goods (GRN)</DialogTitle>
        <DialogContent dividers>
          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">Purchase Order Overview</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2"><strong>PO ID:</strong> {purchaseOrder?.id}</Typography>
            <Typography variant="body2"><strong>Supplier:</strong> {purchaseOrder?.supplier?.name}</Typography>
            <Typography variant="body2"><strong>Items formatting to stock:</strong></Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {purchaseOrder?.items?.map(item => (
                    <li key={item.id}>
                        <Typography variant="body2">{item.product.name} (x{item.quantity})</Typography>
                    </li>
                ))}
            </ul>
          </Box>

          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Remarks (Optional)"
                fullWidth
                multiline
                rows={3}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" color="success" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Confirm Receipt & Update Stock'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GRNForm;
