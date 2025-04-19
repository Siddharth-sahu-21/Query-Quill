'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '@/components/Modal';
 // Import Modal as a separate component

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const router = useRouter();

  // Load existing projects
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Failed to fetch projects:', err));
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('Project name is required');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`, { name: newProjectName });
      const newProject = response.data;

      setProjects([...projects, newProject]);
      setShowModal(false);
      router.push(`/user/${newProject.id}/generator`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 p-4 rounded shadow cursor-pointer hover:bg-gray-700 transition-all duration-200"
            onClick={() => router.push(`/user/${project.id}/generator`)}
          >
            <h2 className="text-xl font-bold">{project.name}</h2>
          </div>
        ))}
      </div>

      {/* Floating "+" Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl flex items-center justify-center shadow-lg"
        title="Create New Project"
      >
        +
      </button>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSave={handleCreateProject}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
        />
      )}
    </div>
  );
}
