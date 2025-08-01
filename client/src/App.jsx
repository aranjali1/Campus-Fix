import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRegister from './pages/AdminRegister';
import SuperAdminDashboard from './pages/SuperDashboard';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes for All Authenticated Users */}
        <Route element={<PrivateRoute allowedRoles={['student', 'admin', 'superadmin']} />}>
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/submit" element={<SubmitComplaint />} />
        </Route>

        {/* Super Admin Only */}
        <Route element={<PrivateRoute allowedRoles={['superadmin']} />}>
          <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
