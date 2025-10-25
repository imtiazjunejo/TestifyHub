import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Dashboard from './pages/Dashboard';
import CreateTest from './pages/CreateTest';
import TestList from './pages/TestList';
import TakeTest from './pages/TakeTest';
import ResultPage from './pages/ResultPage';
import AdminPanel from './pages/AdminPanel';

const AppRoutes = () => {
  const { authUser } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-test" element={<CreateTest />} />
      <Route path="/tests" element={<TestList />} />
      <Route path="/take-test/:id" element={<TakeTest />} />
      <Route path="/results" element={<ResultPage />} />
      {authUser?.role === 'Admin' && (
        <Route path="/admin" element={<AdminPanel />} />
      )}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;