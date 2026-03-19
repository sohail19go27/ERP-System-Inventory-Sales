import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import CustomerList from './components/CustomerList';
import SupplierList from './components/SupplierList';
import SalesOrderList from './components/SalesOrderList';
import PurchaseOrderList from './components/PurchaseOrderList';
import InvoiceList from './components/InvoiceList';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Placeholder for role-specific routes */}
        <Route path="sales" element={<SalesOrderList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="purchases" element={<PurchaseOrderList />} />
        <Route path="inventory" element={<ProductList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="suppliers" element={<SupplierList />} />
      </Route>
    </Routes>
  );
}

export default App;
