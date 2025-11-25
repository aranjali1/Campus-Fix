import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || !role) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      let endpoint = '';
      if (role === 'student') endpoint = '/api/user/me';
      else if (role === 'admin') endpoint = '/api/admin/me';
      else if (role === 'superadmin') endpoint = '/api/superadmin/me';
      else if (role === 'provider') endpoint = '/api/provider/me';
      else {
        setUser(null);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user || data.admin || data.superadmin || data);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.clear();
        setUser(null);
      }
    };

    fetchUser();
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    alert('You have been logged out successfully.');
    navigate('/');
    setUser(null);
  };

  const goToDashboard = () => {
    const role = user?.role;

    if (role === 'student') navigate('/dashboard/user');
    else if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'superadmin') navigate('/dashboard/superadmin');
    else if (role === 'provider') navigate('/dashboard/provider');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-200 shadow-md px-2 sm:px-6 lg:px-8 py-1 rounded-2xl mx-auto mt-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-2 mb-2 sm:mb-0">
          <img src={assets.logo} alt="CampusFix Logo" className="h-16 w-16 object-contain" />
          <p className="text-2xl font-bold text-[#0f172a]">Campus Fix</p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-xl bg-gray-50">
                <FaUserCircle className="text-xl text-gray-700" />
                <div className="text-sm text-gray-700 leading-tight">
                  <p className="font-semibold">
                    {user.role === 'admin' ? user.location : user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>

              {user.role === 'student' && (
                <button
                  onClick={() => navigate('/submit')}
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2 px-4 rounded-xl transition"
                >
                  Raise Complaint
                </button>
              )}

              {/* Dashboard Button */}
              <button
                onClick={goToDashboard}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-2 px-4 rounded-xl transition"
              >
                Dashboard
              </button>
            </>
          )}

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
