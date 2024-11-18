const express = require('express');
const router = express.Router();
const skillController = require('../controller/skillController');

// Create a new skill
router.post('/', skillController.createSkill);

// Get all skills
router.get('/', skillController.getAllSkills);

// Get a single skill by ID
router.get('/:id', skillController.getSkillById);

// Update a skill
router.put('/:id', skillController.updateSkill);

// Delete a skill
router.delete('/:id', skillController.deleteSkill);

module.exports = router;
