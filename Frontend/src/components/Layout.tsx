import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import MedicalRecords from '../pages/MedicalRecords';
import Appointments from '../pages/Appointments';
import MedicalServices from '../pages/MedicalServices';
import AccessManagement from '../pages/AccessManagement';
import Login from '../pages/Login';
import FaceLoginPage from '../pages/FaceLoginPage';
import RegisterFacePage from '../pages/RegisterFacePage';
import NotFound from '../pages/NotFound';

const Layout: React.FC = () => {
  const { isAuthenticated, loading } = useUser();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-essalud-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
    );
  }

  // Si no está autenticado, mostrar rutas públicas
  if (!isAuthenticated) {
    return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/face-login" element={<FaceLoginPage />} />
          <Route path="/register-face" element={<RegisterFacePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
  }

  // Si está autenticado, mostrar layout completo
  return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/medical-services" element={<MedicalServices />} />
              <Route path="/access-management" element={<AccessManagement />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/face-login" element={<Navigate to="/" replace />} />
              <Route path="/register-face" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
  );
};

export default Layout;