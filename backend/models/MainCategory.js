const mongoose = require('mongoose');

// Define the schema for sub-target goals
const SubTargetGoalSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the sub-goal
    isChecked: { type: Boolean, default: false }, // Checkbox state
});

// Define the schema for main target goals
const MainTargetGoalSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the main goal
    isChecked: { type: Boolean, default: false }, // Checkbox state
    subGoals: [SubTargetGoalSchema], // Array of sub-target goals
});

// Define the schema for main categories
const MainCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the main category
    isChecked: { type: Boolean, default: false }, // Checkbox state
    mainGoals: [MainTargetGoalSchema], // Array of main target goals
});

// Create the model
const MainCategory = mongoose.model('MainCategory', MainCategorySchema);

module.exports = MainCategory;
