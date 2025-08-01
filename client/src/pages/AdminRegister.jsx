import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';


const AdminRegister = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password, confirmPassword, location } = form;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try{
      const res=await axios.post('http://localhost:5001/api/admin/register', {
        email,
        password,
        location
      });
      if(res.data.success) {
        setMessage('Registration request submitted successfully. Please wait for approval.');
        setForm({ email: '', password: '', confirmPassword: '', location: '' });
      }else{
        setError(res.data.message || 'Registration failed. Please try again.');
      }
    }catch(err) {
      console.error('Error during registration:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    };
  };

  return (
    <div className="bg-white mt-44 mb-24 text-gray-600 max-w-md w-full mx-auto md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Admin Registration
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter email"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <input
          type="text"
          name="location"
          value={location}
          onChange={handleChange}
          placeholder="Enter your campus location"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-2.5 rounded-full transition"
        >
          Submit Request
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      <div className="text-sm text-center mt-4">
        <p>
          Already registered?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
