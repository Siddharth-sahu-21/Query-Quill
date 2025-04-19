import React from 'react';

export default function Modal({ onClose, onSave, newProjectName, setNewProjectName }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}