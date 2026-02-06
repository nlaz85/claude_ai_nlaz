import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContentPage } from './pages/ContentPage';
import { DealersPage } from './pages/DealersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DistributionPage } from './pages/DistributionPage';

function ProtectedRoutes() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/dealers" element={<DealersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/distribution" element={<DistributionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ProtectedRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
