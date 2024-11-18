const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  icon: {
    type: String, // Stores the name of the React Icon component (e.g., 'FaPython')
    required: true,
  },
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
