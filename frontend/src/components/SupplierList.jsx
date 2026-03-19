import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import supplierService from '../services/supplier.service';
import ContactForm from './ContactForm';
import authService from '../services/auth.service';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = authService.getCurrentUser();
  const isAdminOrPurchaseMgr = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_PURCHASE_MANAGER');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAllSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers', error);
      setErrorMsg('Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAdd = () => {
    setSelectedSupplier(null);
    setFormOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.deleteSupplier(id);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier', error);
        setErrorMsg('Failed to delete supplier.');
      }
    }
  };

  const handleSave = async (data) => {
    if (selectedSupplier && selectedSupplier.id) {
        await supplierService.updateSupplier(selectedSupplier.id, data);
    } else {
        await supplierService.createSupplier(data);
    }
    fetchSuppliers();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'gstin', headerName: 'GSTIN', width: 150 },
  ];

  if (isAdminOrPurchaseMgr) {
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
              {isAdmin && (
                  <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon />
                  </IconButton>
              )}
            </Box>
          );
        },
      });
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Suppliers Directory
        </Typography>
        {isAdminOrPurchaseMgr && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Supplier
            </Button>
        )}
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={suppliers}
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
          <ContactForm 
            open={formOpen}
            handleClose={() => setFormOpen(false)}
            contact={selectedSupplier}
            onSave={handleSave}
            contactType="Supplier"
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

export default SupplierList;
