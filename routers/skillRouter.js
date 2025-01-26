const express = require('express');

const { 
    postSkill, 
    getSkillById,
    getAllSkills, 
    updateSkill, 
    deleteSkill
} = require('../controllers/skillController');

const skillRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

skillRouter.post('/add-skill',authMiddleware,postSkill);

skillRouter.get('/all-skills',getAllSkills);

skillRouter.get('/get-skill-by-id/:id',getSkillById);

skillRouter.put('/update-skill/:id',authMiddleware,updateSkill);

skillRouter.delete('/delete-skill/:id',authMiddleware,deleteSkill);

module.exports = skillRouter;