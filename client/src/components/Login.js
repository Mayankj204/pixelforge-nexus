import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Login = () => {
  const { login } = useContext(AuthContext); // Get the login function from context
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Still make the API call to get the token
      const res = await axios.post('http://localhost:5001/api/users/login', { username, password });
      
      // Use the context to handle the token and state update
      if (res.data.token) {
        await login(res.data.token);
        // No reload needed! React will automatically show the dashboard.
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'An error occurred.');
    }
  };

  // The JSX for the form remains the same as the last styled version
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-3xl font-bold text-gray-900 mt-2 text-center">PixelForge Nexus</div>
        <div className="text-center text-gray-500 mt-1">Project Management Portal</div>
        <div className="bg-white p-8 mt-6 rounded-lg shadow-xl">
          <form onSubmit={onSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button type="submit" className="w-full px-6 py-3 mt-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;