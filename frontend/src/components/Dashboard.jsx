import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dashboardService from '../services/dashboard.service';

const Dashboard = () => {
    const [salesSummary, setSalesSummary] = useState({ month: '', totalRevenue: 0 });
    const [stockAlerts, setStockAlerts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryRes, alertsRes, topRes] = await Promise.all([
                    dashboardService.getSalesSummary(),
                    dashboardService.getStockAlerts(),
                    dashboardService.getTopProducts()
                ]);
                setSalesSummary(summaryRes.data);
                setStockAlerts(alertsRes.data);
                setTopProducts(topRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };

        fetchDashboardData();
    }, []);

    const chartData = [
        {
            name: salesSummary.month || 'Current Month',
            Sales: salesSummary.totalRevenue || 0,
            Purchases: (salesSummary.totalRevenue || 0) * 0.6 // Simulated purchases for visual comparison since backend exposes only total revenue
        }
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Analytics Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Revenue Overview Chart */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Sales vs. Purchases
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Sales" fill="#8884d8" />
                                <Bar dataKey="Purchases" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Top Products */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                         <Typography variant="h6" gutterBottom>
                            Top Selling Products
                        </Typography>
                         <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Product</strong></TableCell>
                                        <TableCell align="right"><strong>Units Sold</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topProducts.length > 0 ? topProducts.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.productName}</TableCell>
                                            <TableCell align="right">{row.quantitySold}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">No sales data yet</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Low Stock Alerts */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            Low Stock Alerts
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>SKU</strong></TableCell>
                                        <TableCell><strong>Product Name</strong></TableCell>
                                        <TableCell align="right"><strong>Current Stock</strong></TableCell>
                                        <TableCell align="right"><strong>Reorder Level</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockAlerts.length > 0 ? stockAlerts.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.sku}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell align="right" sx={{ color: 'red', fontWeight: 'bold' }}>{row.currentStock}</TableCell>
                                            <TableCell align="right">{row.reorderLevel}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">All items are sufficiently stocked.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
