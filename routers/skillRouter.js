const express = require('express');
const { postSkill, getSkillById ,getAllSkills, updateSkill, deleteSkill} = require('../controllers/skillController');
const skillRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
skillRouter.post('/add-skill',authMiddleware,postSkill);
skillRouter.get('/all-skills',authMiddleware,getAllSkills);
skillRouter.get('/get-skill-by-id/:id',authMiddleware,getSkillById);
skillRouter.put('/update-skill/:id',authMiddleware,updateSkill);
skillRouter.delete('/delete-skill/:id',authMiddleware,deleteSkill);
skillRouter
module.exports = skillRouter;