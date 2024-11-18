const Skill = require('../models/Skill');

// Create a new skill
exports.createSkill = async (req, res) => {
  try {
    const { name, description, level, icon } = req.body;
    const newSkill = new Skill({ name, description, level, icon });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating skill' });
  }
};

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching skills' });
  }
};

// Get a single skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(200).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching skill' });
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const { name, description, level, icon } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, description, level, icon },
      { new: true }
    );
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(200).json(skill);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error updating skill' });
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting skill' });
  }
};
