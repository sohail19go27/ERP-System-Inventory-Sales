import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Paper, Snackbar, Alert, Chip, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import salesOrderService from '../services/salesorder.service';
import SalesOrderForm from './SalesOrderForm';
import authService from '../services/auth.service';

const SalesOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Status Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const currentUser = authService.getCurrentUser();
  const isAdminOrSalesExe = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_SALES_EXECUTIVE');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await salesOrderService.getAllSalesOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching sales orders', error);
      setErrorMsg('Failed to load sales orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAdd = () => {
    setFormOpen(true);
  };

  const handleStatusMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(id);
  };

  const handleStatusMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleStatusChange = async (status) => {
    try {
      await salesOrderService.updateOrderStatus(selectedOrderId, status);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status', error);
      setErrorMsg('Failed to update order status.');
    } finally {
      handleStatusMenuClose();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await salesOrderService.deleteSalesOrder(id);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order', error);
        setErrorMsg('Failed to delete order.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Dispatched': return 'info';
      case 'Pending': default: return 'warning';
    }
  };

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 90 },
    { 
      field: 'orderDate', 
      headerName: 'Date', 
      width: 150, 
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    },
    { 
      field: 'customer', 
      headerName: 'Customer', 
      flex: 1, 
      valueGetter: (params) => params.row.customer?.name || 'Unknown' 
    },
    { 
      field: 'totalAmount', 
      headerName: 'Total ($)', 
      width: 130, 
      valueFormatter: (params) => `$${params.value?.toFixed(2)}` 
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color={getStatusColor(params.value)} size="small" />
      )
    }
  ];

  if (isAdminOrSalesExe) {
      columns.push({
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => {
          return (
            <Box>
              <IconButton color="primary" onClick={(e) => handleStatusMenuOpen(e, params.row.id)}>
                <MoreVertIcon />
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
          Sales Orders
        </Typography>
        {isAdminOrSalesExe && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Create Order
            </Button>
        )}
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'orderDate', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('Pending')}>Mark Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange('Approved')}>Mark Approved</MenuItem>
        <MenuItem onClick={() => handleStatusChange('Dispatched')}>Mark Dispatched</MenuItem>
      </Menu>

      {formOpen && (
          <SalesOrderForm 
            open={formOpen}
            handleClose={() => setFormOpen(false)}
            refreshOrders={fetchOrders}
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

export default SalesOrderList;
