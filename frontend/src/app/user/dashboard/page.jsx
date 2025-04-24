'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Dashboard() {
  const [projects, setProjects] = useState([]); // State to store all projects
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const router = useRouter();

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/getall`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setProjects(response.data); // Set the fetched projects in state
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        alert('An error occurred while fetching projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('Project name is required');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/project/create`, { title: newProjectName }, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      console.log('API Response:', response.data); // Log the response
      const newProject = response.data;

      const newProjectId = newProject.id || newProject._id || newProject.projectId;
      if (!newProjectId) {
        console.error('Project ID is missing in the API response');
        alert('Failed to create project. Please try again.');
        return;
      }

      setProjects([...projects, newProject]); // Add the new project to the list
      setShowModal(false);
      router.push(`/user/generator/${newProjectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('An error occurred while creating the project. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {/* Display Projects as Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id || project._id}
            className="bg-gray-800 p-4 rounded shadow cursor-pointer hover:bg-gray-700 transition-all duration-200"
            onClick={() => router.push(`/user/generator/${project._id}`)}
          >
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="text-gray-400 text-sm mt-2">Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Floating "+" Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-xl text-white p-6 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {/* Small Card Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl text-black font-bold mb-4">Create New Project</h2>
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
                onClick={handleCreateProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
