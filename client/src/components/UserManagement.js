import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Developer'
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Could not fetch users", err);
      toast.error("Could not load user list.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { username, password, role } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/users/register', formData);
      toast.success('User created successfully!');
      setFormData({ username: '', password: '', role: 'Developer' });
      fetchUsers(); // Refresh its own list
    } catch (err) {
      toast.error('Error: ' + err.response.data.msg);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New User</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <select name="role" value={role} onChange={onChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Developer">Developer</option>
            <option value="Project Lead">Project Lead</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className="px-6 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900 transition-colors duration-200">Create User</button>
        </form>
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;