import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Paper, Snackbar, Alert, Chip } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Input as ReceiveIcon } from '@mui/icons-material';
import purchaseOrderService from '../services/purchaseorder.service';
import PurchaseOrderForm from './PurchaseOrderForm';
import GRNForm from './GRNForm';
import authService from '../services/auth.service';

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poFormOpen, setPoFormOpen] = useState(false);
  const [grnFormOpen, setGrnFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = authService.getCurrentUser();
  const isPurMgrOrInvMgrOrAdmin = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_PURCHASE_MANAGER') || currentUser?.roles?.includes('ROLE_INVENTORY_MANAGER');
  const isAdminOrPurMgr = currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_PURCHASE_MANAGER');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getAllPurchaseOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders', error);
      setErrorMsg('Failed to load purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAdd = () => {
    setPoFormOpen(true);
  };

  const handleReceive = (order) => {
      setSelectedOrder(order);
      setGrnFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await purchaseOrderService.deletePurchaseOrder(id);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order', error);
        setErrorMsg('Failed to delete order.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'success';
      case 'Ordered': default: return 'warning';
    }
  };

  const columns = [
    { field: 'id', headerName: 'PO ID', width: 90 },
    { 
      field: 'orderDate', 
      headerName: 'Order Date', 
      width: 150, 
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    },
    { 
      field: 'expectedDeliveryDate', 
      headerName: 'Expected Delivery', 
      width: 150, 
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A'
    },
    { 
      field: 'supplier', 
      headerName: 'Supplier', 
      flex: 1, 
      valueGetter: (params) => params.row.supplier?.name || 'Unknown' 
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

  if (isPurMgrOrInvMgrOrAdmin) {
      columns.push({
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => {
          return (
            <Box>
              {params.row.status === 'Ordered' && (
                  <IconButton 
                     color="success" 
                     title="Receive Goods (GRN)"
                     onClick={() => handleReceive(params.row)}
                  >
                    <ReceiveIcon />
                  </IconButton>
              )}
              {isAdmin && (
                  <IconButton color="error" title="Delete PO" onClick={() => handleDelete(params.row.id)}>
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
          Purchase Orders
        </Typography>
        {isAdminOrPurMgr && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Create PO
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

      {poFormOpen && (
          <PurchaseOrderForm 
            open={poFormOpen}
            handleClose={() => setPoFormOpen(false)}
            refreshOrders={fetchOrders}
          />
      )}

      {grnFormOpen && selectedOrder && (
          <GRNForm
             open={grnFormOpen}
             handleClose={() => setGrnFormOpen(false)}
             purchaseOrder={selectedOrder}
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

export default PurchaseOrderList;
