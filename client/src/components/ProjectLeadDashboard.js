import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProjectLeadDashboardSkeleton from './skeletons/ProjectLeadDashboardSkeleton';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

const ProjectLeadDashboard = () => {
    const { authState } = useContext(AuthContext);
    const { user } = authState;
    const [projects, setProjects] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
      try {
        const [projectsRes, developersRes] = await Promise.all([
          axios.get('http://localhost:5001/api/projects'),
          axios.get('http://localhost:5001/api/users/developers')
        ]);
        setProjects(projectsRes.data);
        setDevelopers(developersRes.data);
      } catch (err) { 
          console.error('Error fetching data:', err); 
          toast.error("Could not fetch dashboard data.");
      } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAssign = async (projectId, developerId) => {
        if (!developerId) return toast.error("Please select a developer.");
        try {
            await axios.put(`http://localhost:5001/api/projects/${projectId}/assign`, { userId: developerId });
            toast.success('Developer assigned successfully!');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Could not assign developer.");
        }
    };

    // --- NEW, SIMPLER UNASSIGN FUNCTION ---
    const handleUnassign = async (projectId, developerId, developerName) => {
        if (window.confirm(`Are you sure you want to remove ${developerName} from this project?`)) {
            try {
                await axios.put(`http://localhost:5001/api/projects/${projectId}/unassign`, { userId: developerId });
                toast.success('Developer removed successfully!');
                fetchData();
            } catch (err) {
                toast.error(err.response?.data?.msg || "Could not remove developer.");
            }
        }
    };

    if (loading) { return <ProjectLeadDashboardSkeleton />; }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Lead Dashboard</h1>
                <p className="mt-1 text-lg text-gray-600">Welcome, {user?.username}! Assign developers to projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Active Projects" value={projects.filter(p => p.status === 'Active').length} icon={'⏳'} />
                <StatCard title="Available Developers" value={developers.length} icon={'👨‍💻'} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Team Management</h2>
                <div className="space-y-6">
                    {projects.filter(p => p.status === 'Active').map(project => {
                        const assignedDevIds = new Set(project.assignedUsers.map(u => u._id));
                        const availableDevelopers = developers.filter(d => !assignedDevIds.has(d._id));
                        
                        return (
                            <div key={project._id} className="p-6 border rounded-lg">
                                <Link to={`/project/${project._id}`} className="text-xl font-semibold text-blue-600 hover:underline">{project.name}</Link>
                                
                                {/* Current Team List with Remove Buttons */}
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700">Current Team:</h4>
                                    {project.assignedUsers.length > 0 ? (
                                        <ul className="mt-2 space-y-2">
                                            {project.assignedUsers.map(dev => (
                                                <li key={dev._id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                                                    <span className="font-medium">{dev.username}</span>
                                                    <button onClick={() => handleUnassign(project._id, dev._id, dev.username)} className="text-red-500 hover:text-red-700 font-semibold text-sm">
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-gray-500 mt-1">No developers assigned yet.</p>}
                                </div>

                                {/* Add Developer Form */}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const devId = e.target.elements.developer.value;
                                    handleAssign(project._id, devId);
                                }} className="flex items-center space-x-2 mt-4 pt-4 border-t">
                                    <select name="developer" defaultValue="" className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="" disabled>-- Add a Developer --</option>
                                        {availableDevelopers.map(dev => (
                                            <option key={dev._id} value={dev._id}>{dev.username}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900">Assign</button>
                                </form>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectLeadDashboard;