import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DeveloperDashboardSkeleton from './skeletons/DeveloperDashboardSkeleton';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

const DeveloperDashboard = () => {
    const { authState } = useContext(AuthContext);
    const { user } = authState;
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyProjects = async () => {
          try {
            const res = await axios.get('http://localhost:5001/api/projects/my-projects');
            setMyProjects(res.data);
          } catch (err) { console.error('Error fetching assigned projects:', err); }
          finally { setLoading(false); }
        };
        fetchMyProjects();
    }, []);

    if (loading) { return <DeveloperDashboardSkeleton />; }

    const activeProjects = myProjects.filter(p => p.status === 'Active');
    const completedProjects = myProjects.filter(p => p.status === 'Completed');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
                <p className="mt-1 text-lg text-gray-600">Welcome, {user?.username}! Here are your assigned projects.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Assigned Projects" value={myProjects.length} icon={'💼'} />
                <StatCard title="Active Projects" value={activeProjects.length} icon={'⏳'} />
                <StatCard title="Completed Projects" value={completedProjects.length} icon={'✅'} />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Active Projects</h2>
                {activeProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.map(project => (
                    <div key={project._id} className="bg-white rounded-lg shadow flex flex-col justify-between">
                        <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                            <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{project.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
                            <div>
                                <p className="text-xs text-gray-500">Deadline</p>
                                <p className="text-sm font-medium text-gray-800">{new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                            <Link to={`/project/${project._id}`} className="px-4 py-2 text-sm text-white bg-gray-800 rounded-md hover:bg-gray-900">
                                View Details
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">You have no active projects.</p>
                </div>
                )}
            </div>
        </div>
    );
};

export default DeveloperDashboard;