import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../utils/api';

const ProviderRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    categories: []
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categoryOptions = ['electrician', 'plumber', 'carpenter', 'cleaner', 'other'];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      categories: checked
        ? [...prevForm.categories, value]
        : prevForm.categories.filter((cat) => cat !== value)
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (form.categories.length === 0) {
      setError('Please select at least one category.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/provider/register`, form);
      setMessage(res.data.message || 'Registration successful!');
      setForm({ name: '', email: '', password: '', phone: '', categories: [] });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-44 mb-24 text-gray-600 max-w-md w-full mx-auto md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Service Provider Registration
      </h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full border border-gray-300 rounded-full py-2.5 px-4 outline-none"
        />

        <div>
          <label className="font-semibold text-sm block mb-2">Select Categories:</label>
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={cat}
                  checked={form.categories.includes(cat)}
                  onChange={handleCheckboxChange}
                  className="accent-blue-600"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-2.5 rounded-full transition"
        >
          {loading ? 'Registering...' : 'Register'}
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

export default ProviderRegister;
