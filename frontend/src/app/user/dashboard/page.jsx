'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Innavbar from '@/components/Innavbar';
import Footer from '@/components/footer';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        router.push(`/user/generator/${newProjectId}`);
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
    <div>
      <Innavbar />
      <div className="min-h-screen bg-gray-900 text-white p-6 relative">
        <h1 className="text-3xl font-bold mb-6">welcome back {userName}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id || project._id}
              className="bg-gray-800 p-4 rounded shadow cursor-pointer hover:bg-gray-700 transition-all duration-200"
            >
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-gray-400 text-sm mt-2">
                Created At: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => router.push(`/user/generator/${project._id}`)}
                >
                  Open
                </button>
                <button
                  className="text-yellow-500 hover:underline"
                  onClick={() => handleEditProject(project._id, project.title)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => confirmDeleteProject(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="fixed bottom-6 right-6 bg-blue-600 text-xl text-white p-6 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
          onClick={() => {
            setShowModal(true);
            setEditProjectId(null);
            setNewProjectName('');
          }}
        >
          +
        </button>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h2 className="text-xl text-black font-bold mb-4">
                {editProjectId ? 'Edit Project Title' : 'Create New Project'}
              </h2>
              <input
                type="text"
                className="w-full text-black p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-all duration-200"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200"
                  onClick={handleCreateOrUpdateProject}
                >
                  {editProjectId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h2 className="text-xl text-black font-bold mb-4">Confirm Delete</h2>
              <p className="text-black mb-4">Are you sure you want to delete this project?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
