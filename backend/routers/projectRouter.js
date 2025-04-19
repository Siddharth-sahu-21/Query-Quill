const express = require('express');
const Model = require('../models/ProjectModel');

const router = express.Router();

// Route to create a new project
router.post('/create',  async (req, res) => {
    try { 
        const newProject = new Model(req.body);
        const result = await newProject.save();
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// Route to get all projects for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const projects = await Model.find({ userId: req.params.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get a specific project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Model.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to update a project by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(updatedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a project by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await Model.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;



