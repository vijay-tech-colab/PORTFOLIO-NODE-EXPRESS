const express = require('express');
const { addProject, getProjects, getProject, updateProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware')
const projectRouter = express.Router();

// Define your routes here
projectRouter.post('/add-project', authMiddleware, addProject);

projectRouter.get('/get-projects', authMiddleware, getProjects);

projectRouter.get('/get-project/:id', authMiddleware, getProject);

projectRouter.put('/update-project/:id', authMiddleware, updateProject);

projectRouter.delete('/delete-project/:id', authMiddleware, deleteProject);

module.exports = projectRouter;