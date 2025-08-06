import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../utils/api';

const Login = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [state, setState] = useState('login');
  const [role, setRole] = useState('student'); // student | admin | superadmin | provider
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prevent signup for restricted roles
    if (state === 'signup' && (role === 'admin' || role === 'superadmin' || role === 'provider')) {
      alert(`${role[0].toUpperCase() + role.slice(1)}s must register through the dedicated registration page.`);
      setLoading(false);
      return;
    }

    const dataToSend =
      state === 'signup'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

    const endpoint =
      state === 'signup'
        ? '/api/user/register'
        : role === 'admin'
        ? '/api/admin/login'
        : role === 'superadmin'
        ? '/api/superadmin/login'
        : role === 'provider'
        ? '/api/provider/login'
        : '/api/user/login';

    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, dataToSend);
      const { token, user, admin, superadmin, provider } = res.data;
      const account = user || admin || superadmin || provider;

      if (!token) throw new Error('No token received from server');

      // ✅ Store token based on role
      localStorage.setItem('token', token);

      localStorage.setItem('role', account?.role || role);
      localStorage.setItem('user', JSON.stringify(account || {}));

      if (state === 'signup') {
        alert('Registration successful! Please log in.');
        setState('login');
        setForm({ name: '', email: '', password: '' });
      } else {
        const resolvedRole = account?.role || role;
        if (resolvedRole === 'superadmin') {
          navigate('/dashboard/superadmin');
        } else if (resolvedRole === 'admin') {
          navigate('/dashboard/admin');
        } else if (resolvedRole === 'provider') {
          navigate('/dashboard/provider');
        } else {
          navigate('/dashboard/user');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Authentication failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const { name, email, password } = form;

  return (
    <div className="bg-white mt-44 mb-24 text-gray-600 max-w-md w-full mx-auto md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {state === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {state === 'signup' && (
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-full outline-none"
              required
            />
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
          required
        />

        <div className="flex gap-4 mt-1 mb-2 flex-wrap">
          {['student', 'admin', 'superadmin', 'provider'].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="capitalize">{r}</span>
            </label>
          ))}
        </div>

        <div className="text-right py-2">
          <a href="#" className="text-blue-600 underline text-sm">Forgot Password?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-2.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (state === 'login' ? 'Log In' : 'Sign Up')}
        </button>
      </form>

      <div className="text-sm text-center mt-2">
        {state === 'signup' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('login')}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Log In
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <span
              onClick={() => setState('signup')}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>

      <div className="text-sm text-center mt-3">
        <p>
          Want to become an admin?{' '}
          <span
            onClick={() => navigate('/admin/register')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register as Admin
          </span>
        </p>
        <p className="mt-1">
          Want to become a service provider?{' '}
          <span
            onClick={() => navigate('/provider/register')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register as Service Provider
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
