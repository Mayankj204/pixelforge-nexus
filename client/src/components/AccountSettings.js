import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const { currentPassword, newPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long.');
        return;
    }
    try {
      const res = await axios.put('http://localhost:5001/api/users/update-password', formData);
      toast.success(res.data.msg); // "Password updated successfully."
      setFormData({ currentPassword: '', newPassword: '' }); // Clear form
    } catch (err) {
      toast.error('Error: ' + err.response.data.msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            <span>Back to Dashboard</span>
        </Link>
      
      <div className="mt-4 max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full px-6 py-3 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors duration-200">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;