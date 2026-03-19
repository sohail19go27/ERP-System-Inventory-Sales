import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, IconButton, Paper, Snackbar, Alert, Chip, Button } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import invoiceService from '../services/invoice.service';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getAllInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices', error);
      setErrorMsg('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadPdf = async (id) => {
    try {
        const response = await invoiceService.downloadInvoicePdf(id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error('Failed to download PDF', err);
        setErrorMsg('Could not download the invoice PDF.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Unpaid': default: return 'error';
    }
  };

  const columns = [
    { field: 'id', headerName: 'Invoice ID', width: 100 },
    { 
      field: 'creationDate', 
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
      field: 'taxAmount', 
      headerName: 'Tax ($)', 
      width: 120, 
      valueFormatter: (params) => `$${params.value?.toFixed(2)}` 
    },
    { 
      field: 'totalPayable', 
      headerName: 'Total Payable ($)', 
      width: 150, 
      valueFormatter: (params) => `$${params.value?.toFixed(2)}` 
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={getStatusColor(params.value)} size="small" />
      )
    },
    {
      field: 'actions',
      headerName: 'Download PDF',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
             variant="outlined"
             color="primary"
             size="small"
             startIcon={<PdfIcon />}
             onClick={() => handleDownloadPdf(params.row.id)}
          >
             PDF
          </Button>
        );
      },
    }
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Invoices
        </Typography>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'creationDate', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')}>
        <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceList;
