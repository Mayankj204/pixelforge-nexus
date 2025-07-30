import React, { useState, useEffect, useContext } from 'react'; // 'useCallback' has been removed
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import ProjectDetailsSkeleton from './skeletons/ProjectDetailsSkeleton';

const ProjectDetails = () => {
  const { id } = useParams();
  const { authState: { user } } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectRes = await axios.get(`http://localhost:5001/api/projects/${id}`);
        setProject(projectRes.data);
        const docsRes = await axios.get(`http://localhost:5001/api/documents/${id}`);
        setDocuments(docsRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Could not load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  const onFileChange = e => setFile(e.target.files[0]);

  const onFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    const toastId = toast.loading('Uploading document...');
    try {
      await axios.post(`http://localhost:5001/api/documents/${id}/upload`, formData);
      toast.success('File uploaded successfully!', { id: toastId });
      setFile(null);
      const docsRes = await axios.get(`http://localhost:5001/api/documents/${id}`);
      setDocuments(docsRes.data);
    } catch (err) {
      toast.error('Upload failed.', { id: toastId });
    }
  };

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }
  
  // ... rest of the JSX is the same
  if (!project) {
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10">
            <p>Project not found.</p>
        </div>
    );
  }
  
  const canUpload = user && (user.role === 'Admin' || user.role === 'Project Lead');
  const TabButton = ({ tabName, label }) => (
    <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
            <Link to="/" className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Back to Dashboard</span>
            </Link>
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate">{project.name}</h1>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6 text-sm text-gray-500">
                        <div className="mt-2 flex items-center"><strong>Status:</strong><span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{project.status}</span></div>
                        <div className="mt-2 flex items-center"><strong>Deadline:</strong><span className="ml-2">{new Date(project.deadline).toLocaleDateString()}</span></div>
                        <div className="mt-2 flex items-center"><strong>Created:</strong><span className="ml-2">{new Date(project.createdAt).toLocaleDateString()}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs"><TabButton tabName="overview" label="Overview" /><TabButton tabName="team" label="Team" /><TabButton tabName="documents" label="Documents" /></nav>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
            {activeTab === 'overview' && (<div><h3 className="text-xl font-bold text-gray-800 mb-2">Project Description</h3><p className="text-gray-700 whitespace-pre-wrap">{project.description}</p></div>)}
            {activeTab === 'team' && (<div><h3 className="text-xl font-bold text-gray-800 mb-4">Assigned Team</h3><ul className="space-y-3">{project.assignedUsers.map(member => (<li key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md"><span className="font-medium text-gray-900">{member.username}</span><span className="text-sm text-gray-500">{member.role}</span></li>))}{project.assignedUsers.length === 0 && <p className="text-gray-500">No one is assigned to this project yet.</p>}</ul></div>)}
            {activeTab === 'documents' && (<div><h3 className="text-xl font-bold text-gray-800 mb-4">Project Documents</h3><ul className="space-y-3">{documents.map(doc => (<li key={doc._id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"><a href={`http://localhost:5001/${doc.filePath}`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">{doc.fileName}</a><span className="text-xs text-gray-400">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span></li>))}{documents.length === 0 && <p className="text-gray-500">No documents have been uploaded for this project.</p>}</ul>{canUpload && (<div className="mt-6 pt-6 border-t"><h4 className="font-semibold text-gray-700 mb-2">Upload New Document</h4><div className="flex items-center space-x-2"><input type="file" onChange={onFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/><button onClick={onFileUpload} disabled={!file} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">Upload</button></div></div>)}</div>)}
        </div>
    </div>
  );
};

export default ProjectDetails;