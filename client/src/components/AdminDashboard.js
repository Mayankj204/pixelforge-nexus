import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import UserManagement from './UserManagement';
import AdminDashboardSkeleton from './skeletons/AdminDashboardSkeleton';

const StatCard = ({ title, value, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {children || <p className="text-2xl font-bold text-gray-900">{value}</p>}
        </div>
      </div>
    </div>
  );

const TabButton = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 
            ${isActive 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
    >
        {children}
    </button>
);

const AdminDashboard = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', deadline: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  const fetchAllData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/projects'),
        axios.get('http://localhost:5001/api/users')
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) { 
        console.error('Error fetching data:', err);
        toast.error('Could not fetch dashboard data.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const { name, description, deadline } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/projects', formData);
      toast.success('Project created successfully!');
      setFormData({ name: '', description: '', deadline: '' });
      fetchAllData();
    } catch (err) { toast.error('Error: ' + err.response.data.msg); }
  };
  
  const handleComplete = async (projectId) => {
    try {
      await axios.put(`http://localhost:5001/api/projects/${projectId}/complete`);
      toast.success('Project marked as complete!');
      fetchAllData();
    } catch (err) { toast.error('Error: ' + err.response.data.msg); }
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }
  
  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-lg text-gray-600">Welcome, {user?.username}! Here you can manage projects and users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={projects.length} icon={'📁'} />
        <StatCard title="Active Projects" value={activeProjectsCount} icon={'⏳'} />
        <StatCard title="Total Users" icon={'👥'}>
            <div className="text-gray-900 font-bold">
                <p className="text-sm">Admins: <span className="text-lg">{roleCounts['Admin'] || 0}</span></p>
                <p className="text-sm">Leads: <span className="text-lg">{roleCounts['Project Lead'] || 0}</span></p>
                <p className="text-sm">Developers: <span className="text-lg">{roleCounts['Developer'] || 0}</span></p>
            </div>
        </StatCard>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <TabButton isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')}>Project Management</TabButton>
            <TabButton isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>User Management</TabButton>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Active Projects</h2>
                    <div className="space-y-4">
                        {projects.filter(p => p.status === 'Active').map(project => (
                        <div key={project._id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                            <div>
                            <Link to={`/project/${project._id}`} className="font-semibold text-blue-600 hover:underline">{project.name}</Link>
                            <p className="text-sm text-gray-500">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => handleComplete(project._id)} className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600">Complete</button>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Project</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input type="text" placeholder="Project Name" name="name" value={name} onChange={onChange} required className="w-full px-4 py-2 border rounded-md"/>
                        <textarea placeholder="Description" name="description" value={description} onChange={onChange} required className="w-full px-4 py-2 border rounded-md" />
                        <input type="date" name="deadline" value={deadline} onChange={onChange} required className="w-full px-4 py-2 border rounded-md" />
                        <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Project</button>
                    </form>
                </div>
            </div>
        )}
        {activeTab === 'users' && ( <UserManagement /> )}
      </div>
    </div>
  );
};

export default AdminDashboard;