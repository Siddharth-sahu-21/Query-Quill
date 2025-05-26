const express = require('express');
const Model = require('../models/ProjectModel');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Route to create a new project
router.post('/create', verifyToken, async (req, res) => {
    try {
        const newProject = new Model({ ...req.body, user: req.user._id });
        const result = await newProject.save();
        res.status(201).json(result); // Return the created project
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: err.message });
    }
});



// Route to fetch all projects for the authenticated user
router.get('/getall', verifyToken, async (req, res) => {
    try {
        const projects = await Model.find({ user: req.user._id });
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: err.message });
    }
});

// Route to fetch a specific project by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Model.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ error: err.message });
    }
});



// Route to update a project by ID
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const updatedProject = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(updatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a project by ID
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const deletedProject = await Model.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;