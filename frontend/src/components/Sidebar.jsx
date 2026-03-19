import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Box, Typography, Button, ListSubheader } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, Inventory as InventoryIcon, ShoppingCart as SalesIcon, ExitToApp as LogoutIcon, Group as GroupIcon, LocalShipping as SupplierIcon, ShoppingBasket as PurchaseIcon, Receipt as InvoiceIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const defaultItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    ];

    if (!user) return defaultItems;

    const roles = user.roles || [];

    if (roles.includes('ROLE_ADMIN')) {
      return [
        ...defaultItems,
        { text: 'Users', icon: <PeopleIcon />, path: '/users' },
        { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
        { text: 'Sales', icon: <SalesIcon />, path: '/sales' },
        { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices' },
        { text: 'Purchases', icon: <PurchaseIcon />, path: '/purchases' },
        { text: 'Customers', icon: <GroupIcon />, path: '/customers', group: 'Directory' },
        { text: 'Suppliers', icon: <SupplierIcon />, path: '/suppliers', group: 'Directory' },
      ];
    } else if (roles.includes('ROLE_SALES_EXECUTIVE')) {
      return [
        ...defaultItems,
        { text: 'Sales', icon: <SalesIcon />, path: '/sales' },
        { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices' },
        { text: 'Customers', icon: <GroupIcon />, path: '/customers', group: 'Directory' },
      ];
    } else if (roles.includes('ROLE_PURCHASE_MANAGER')) {
      return [
        ...defaultItems,
        { text: 'Purchases', icon: <PurchaseIcon />, path: '/purchases' },
        { text: 'Suppliers', icon: <SupplierIcon />, path: '/suppliers', group: 'Directory' },
      ];
    } else if (roles.includes('ROLE_INVENTORY_MANAGER')) {
      return [
        ...defaultItems,
        { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
        { text: 'Purchases', icon: <PurchaseIcon />, path: '/purchases' },
      ];
    }
    // and so on for other roles...

    return defaultItems;
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ERP System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
               '&.Mui-selected': {
                 backgroundColor: 'rgba(25, 118, 210, 0.08)',
                 borderRight: '3px solid #1976d2',
               }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
           Logged in as: {user?.username}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
