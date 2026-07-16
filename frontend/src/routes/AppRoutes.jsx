import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import CustomersPage from "../pages/Customers/CustomersPage";
import CustomerProfilePage from "../pages/CustomerProfile/CustomerProfilePage";
import ProductsPage from "../pages/Products/ProductsPage";
import ProductProfilePage from "../pages/ProductProfile/ProductProfilePage";
import BillingPage from "../pages/Billing/BillingPage";
import InvoicePage from "../pages/Invoice/InvoicePage";
import DueReportPage from "../pages/DueReport/DueReportPage";
import BillsPage from "../pages/Bills/BillsPage";
import HoldBillsPage from "../pages/HoldBills/HoldBillsPage";
import DailyReportPage from "../pages/Reports/DailyReportPage";
import ProtectedRoute from "./ProtectedRoute";
import MonthlyReportPage from "../pages/Reports/MonthlyReportPage";
import RangeReportPage from "../pages/Reports/RangeReportPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import SecurityPage from "../pages/Security/SecurityPage";
import BillDetailsPage from "../pages/BillDetails/BillDetailsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice/:id"
          element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/due-report"
          element={
            <ProtectedRoute>
              <DueReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hold-bills"
          element={
            <ProtectedRoute>
              <HoldBillsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <BillsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills/:id"
          element={
            <ProtectedRoute>
              <BillDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daily-report"
          element={
            <ProtectedRoute>
              <DailyReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monthly-report"
          element={
            <ProtectedRoute>
              <MonthlyReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/range-report"
          element={
            <ProtectedRoute>
              <RangeReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
