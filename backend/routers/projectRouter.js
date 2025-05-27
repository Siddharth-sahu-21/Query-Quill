const express = require('express');
const Model = require('../models/ProjectModel');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Create a new project
router.post('/create', verifyToken, async (req, res) => {
    try {
        const newProject = new Model({ ...req.body, user: req.user._id });
        const result = await newProject.save();
        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: err.message });
    }
});

// Save generated query and parameters for a project (Query Generator)
router.put('/:id/query', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { generatedQuery, parameters } = req.body;

    try {
        const update = { generatedQuery };
        if (parameters) {
            update.parameters = {
                ...parameters,
                customOperationName: parameters.customOperationName || 'GeneratedQuery'
            };
        }
        const updatedProject = await Model.findByIdAndUpdate(
            id,
            update,
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(updatedProject);
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- Server Code Generator Endpoints ---

// Save server code and schema for a project
router.put('/:id/servercode', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { types, schema, serverCode } = req.body;

    try {
        const update = {
            types: types || [],
            schema: schema || '',
            serverCode: serverCode || ''
        };
        const updatedProject = await Model.findByIdAndUpdate(
            id,
            update,
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(updatedProject);
    } catch (err) {
        console.error('Error saving server code:', err);
        res.status(500).json({ error: err.message });
    }
});

// Fetch server code and schema for a project
router.get('/:id/servercode', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Model.findById(id, 'types schema serverCode');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({
            types: project.types,
            schema: project.schema,
            serverCode: project.serverCode
        });
    } catch (err) {
        console.error('Error fetching server code:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- End Server Code Generator Endpoints ---

// Fetch all projects for the authenticated user
router.get('/getall', verifyToken, async (req, res) => {
    try {
        const projects = await Model.find({ user: req.user._id });
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: err.message });
    }
});

// Fetch a specific project by ID
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

// Fetch the generated query and parameters for a specific project (for Query Generator)
router.get('/:id/query', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Model.findById(id, 'generatedQuery parameters');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({
            generatedQuery: project.generatedQuery,
            parameters: project.parameters
        });
    } catch (err) {
        console.error('Error fetching generated query and parameters:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update a project by ID
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

// Delete a project by ID
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