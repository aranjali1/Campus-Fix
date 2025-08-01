import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('User data:', data);
        setUser(data.user || data); // Assumes backend returns { name, role }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    fetchUser();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('You have been logged out successfully.');
    navigate('/');
    setUser(null);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200 shadow-md px-2 sm:px-6 lg:px-8 py-1 rounded-2xl mx-auto mt-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Left: Logo + Brand Name */}
        <div onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-2 mb-2 sm:mb-0">
          <img src={assets.logo} alt="CampusFix Logo" className="h-16 w-16 object-contain" />
          <p className="text-2xl font-bold text-[#0f172a]">Campus Fix</p>
        </div>

        {/* Right: User Info + Buttons */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-xl bg-gray-50">
                <FaUserCircle className="text-xl text-gray-700" />
                <div className="text-sm text-gray-700 leading-tight">
                  <p className="font-semibold">
                    {user.role==='admin'?user.location:user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>

              {/* Raise Complaint Button */}
              {user.role === 'student' && (
                <button
                onClick={() => navigate('/submit')}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2 px-4 rounded-xl transition"
              >
                Raise Complaint
              </button>
              )}

            </>
          )}

          {/* Login / Logout Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-[#0f172a] border border-[#0f172a] hover:bg-[#0f172a] hover:text-white font-medium py-2 px-4 rounded-xl transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-[#0f172a] border border-[#0f172a] hover:bg-[#0f172a] hover:text-white font-medium py-2 px-4 rounded-xl transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
