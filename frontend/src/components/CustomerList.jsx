import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import customerService from '../services/customer.service';
import ContactForm from './ContactForm';
import authService from '../services/auth.service';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = authService.getCurrentUser();
  const isAdminOrSalesExe = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_SALES_EXECUTIVE');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers', error);
      setErrorMsg('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setFormOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer', error);
        setErrorMsg('Failed to delete customer.');
      }
    }
  };

  const handleSave = async (data) => {
    if (selectedCustomer && selectedCustomer.id) {
        await customerService.updateCustomer(selectedCustomer.id, data);
    } else {
        await customerService.createCustomer(data);
    }
    fetchCustomers();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'gstin', headerName: 'GSTIN', width: 150 },
  ];

  if (isAdminOrSalesExe) {
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
          Customers Directory
        </Typography>
        {isAdminOrSalesExe && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Customer
            </Button>
        )}
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={customers}
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
            contact={selectedCustomer}
            onSave={handleSave}
            contactType="Customer"
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

export default CustomerList;
