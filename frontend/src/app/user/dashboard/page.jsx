'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Innavbar from '@/components/Innavbar';
import Footer from '@/components/footer';
import DropdownMenu from '@/components/DropdownMenu';
import { MoreVertical, Code2, Database, Plus, Folder } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // State for dropdown toggle
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/getall`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('An error occurred while fetching projects.');
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getdetails`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setUserName(response.data.name || 'User');
      } catch (error) {
        console.error('Failed to fetch user details:', error.response?.data || error.message);
        toast.error('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, []);

  const handleCreateOrUpdateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      if (editProjectId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/project/update/${editProjectId}`,
          { title: newProjectName },
          {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          }
        );

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editProjectId || project._id === editProjectId
              ? { ...project, title: newProjectName }
              : project
          )
        );
        toast.success('Project title updated successfully!');
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/project/create`,
          { title: newProjectName },
          {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          }
        );
        const newProject = response.data;
        const newProjectId = newProject.id || newProject._id || newProject.projectId;
        if (!newProjectId) {
          console.error('Project ID is missing in the API response');
          toast.error('Failed to create project. Please try again.');
          return;
        }

        setProjects([...projects, newProject]);
        // router.push(`/user/generator/${newProjectId}`); // <-- Remove this line
      }

      setShowModal(false);
      setNewProjectName('');
      setEditProjectId(null);
    } catch (error) {
      console.error('Error creating/updating project:', error);
      toast.error('An error occurred while creating/updating the project.');
    }
  };

  const handleEditProject = (projectId, currentTitle) => {
    setEditProjectId(projectId);
    setNewProjectName(currentTitle);
    setShowModal(true);
  };

  const confirmDeleteProject = (projectId) => {
    setDeleteProjectId(projectId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/project/delete/${deleteProjectId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== deleteProjectId && project.id !== deleteProjectId)
      );
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    } finally {
      setShowDeleteModal(false);
      setDeleteProjectId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Vector Lines - Kept unchanged */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="animate-draw-1" d="M0,30 Q25,5 50,30 T100,30" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-2" d="M0,50 Q25,25 50,50 T100,50" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-3" d="M0,70 Q25,45 50,70 T100,70" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#DB2777"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Grid Pattern - Kept unchanged */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        {/* Gradient Circles - Reduced blur */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-xl animate-float-delay"></div>
      </div>

      <div className="relative z-10">
        <Innavbar />
        
        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Welcome Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Welcome back, {userName}
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your GraphQL projects and generate schemas & queries
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project) => (
              <div
                key={project.id || project._id}
                className="group relative"
              >
                {/* Updated gradient border effect */}
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                
                {/* Card content */}
                <div className="relative p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Folder 
                        size={20} 
                        className="text-violet-400 group-hover:text-violet-300 transition-colors"
                        strokeWidth={1.5}
                      />
                      {project.title}
                    </h2>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown((prev) => (prev === project._id ? null : project._id));
                        }}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <MoreVertical size={18} className="text-gray-400 hover:text-white" />
                      </button>
                      <DropdownMenu
                        isOpen={openDropdown === project._id}
                        onClose={() => setOpenDropdown(null)}
                      >
                        <button
                          className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project._id, project.title);
                            setOpenDropdown(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="flex items-center px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteProject(project._id);
                            setOpenDropdown(null);
                          }}
                        >
                          Delete
                        </button>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/user/QueryGenerator/${project._id}`)}
                      className="w-full group relative px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg 
                      bg-gradient-to-r from-violet-700 to-fuchsia-800 
                      hover:from-fuchsia-700 hover:to-violet-800
                      text-white font-medium transition-all duration-300"
                    >
                      <Code2 size={18} />
                      Query Generator
                    </button>
                    
                    <button
                      onClick={() => router.push(`/user/ServerCodeGenerator/${project._id}`)}
                      className="w-full group relative px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg 
                      bg-gradient-to-r from-fuchsia-700 to-pink-800
                      hover:from-pink-700 hover:to-fuchsia-800
                      text-white font-medium transition-all duration-300"
                    >
                      <Database size={18} />
                      Schema Generator
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Project Button */}
          <button
            onClick={() => {
              setShowModal(true);
              setEditProjectId(null);
              setNewProjectName('');
            }}
            className="fixed bottom-8 right-8 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative p-4 bg-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <Plus size={24} className="text-white" />
            </div>
            <span className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-opacity duration-200 whitespace-nowrap">
              Create New Project
            </span>
          </button>

          {/* Modal Styling */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gray-900 p-6 rounded-xl w-96">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {editProjectId ? 'Edit Project' : 'Create Project'}
                  </h2>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                      onClick={handleCreateOrUpdateProject}
                    >
                      {editProjectId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gray-900 p-6 rounded-xl w-96">
                  <h2 className="text-2xl font-bold text-white mb-4">Delete Project</h2>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to delete this project? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
