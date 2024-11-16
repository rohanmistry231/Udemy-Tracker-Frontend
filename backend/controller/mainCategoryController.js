const MainCategory = require('../models/MainCategory');

// Get all main categories
exports.getMainCategories = async (req, res) => {
    try {
        const mainCategories = await MainCategory.find();
        res.status(200).json(mainCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching main categories', error });
    }
};


// Create a new main category
exports.createMainCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const newMainCategory = new MainCategory({
            name,
            isChecked: false,
            mainGoals: []
        });

        await newMainCategory.save();
        res.status(201).json(newMainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating main category', error });
    }
};

// Update an existing main category
exports.updateMainCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, isChecked } = req.body;

    try {
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        mainCategory.name = name || mainCategory.name;
        mainCategory.isChecked = isChecked !== undefined ? isChecked : mainCategory.isChecked;

        await mainCategory.save();
        res.status(200).json(mainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating main category', error });
    }
};

// Delete a main category
exports.deleteMainCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        await MainCategory.findByIdAndDelete(categoryId);
        res.status(200).json({ message: 'Main category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting main category', error });
    }
};

// Create a new main target goal
exports.createMainTargetGoal = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    try {
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        const newMainGoal = { name, isChecked: false, subGoals: [] };
        mainCategory.mainGoals.push(newMainGoal);

        await mainCategory.save();
        res.status(201).json(mainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating main target goal', error });
    }
};

// Update a main target goal
exports.updateMainTargetGoal = async (req, res) => {
    const { categoryId, goalId } = req.params;
    const { name, isChecked } = req.body;

    try {
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        const mainGoal = mainCategory.mainGoals.id(goalId);

        if (!mainGoal) {
            return res.status(404).json({ message: 'Main target goal not found' });
        }

        mainGoal.name = name || mainGoal.name;
        mainGoal.isChecked = isChecked !== undefined ? isChecked : mainGoal.isChecked;

        await mainCategory.save();
        res.status(200).json(mainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating main target goal', error });
    }
};

// Delete a main target goal
exports.deleteMainTargetGoal = async (req, res) => {
    const { categoryId, goalId } = req.params;

    try {
        // Find the main category by ID
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        // Find the index of the main goal
        const goalIndex = mainCategory.mainGoals.findIndex(goal => goal._id.toString() === goalId);

        if (goalIndex === -1) {
            return res.status(404).json({ message: 'Main target goal not found' });
        }

        // Remove the main target goal from the array
        mainCategory.mainGoals.splice(goalIndex, 1);

        // Save the updated category
        await mainCategory.save();

        res.status(200).json({ message: 'Main target goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting main target goal', error: error.message });
    }
};

// Create a new sub-target goal
exports.createSubTargetGoal = async (req, res) => {
    const { categoryId, goalId } = req.params;
    const { name } = req.body;

    try {
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        const mainGoal = mainCategory.mainGoals.id(goalId);

        if (!mainGoal) {
            return res.status(404).json({ message: 'Main target goal not found' });
        }

        const newSubGoal = { name, isChecked: false };
        mainGoal.subGoals.push(newSubGoal);

        await mainCategory.save();
        res.status(201).json(mainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sub-target goal', error });
    }
};

// Update a sub-target goal
exports.updateSubTargetGoal = async (req, res) => {
    const { categoryId, goalId, subGoalId } = req.params;
    const { name, isChecked } = req.body;

    try {
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        const mainGoal = mainCategory.mainGoals.id(goalId);

        if (!mainGoal) {
            return res.status(404).json({ message: 'Main target goal not found' });
        }

        const subGoal = mainGoal.subGoals.id(subGoalId);

        if (!subGoal) {
            return res.status(404).json({ message: 'Sub-target goal not found' });
        }

        subGoal.name = name || subGoal.name;
        subGoal.isChecked = isChecked !== undefined ? isChecked : subGoal.isChecked;

        await mainCategory.save();
        res.status(200).json(mainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sub-target goal', error });
    }
};

// Delete a sub-target goal
exports.deleteSubTargetGoal = async (req, res) => {
    const { categoryId, goalId, subGoalId } = req.params;

    try {
        // Find the main category by ID
        const mainCategory = await MainCategory.findById(categoryId);

        if (!mainCategory) {
            return res.status(404).json({ message: 'Main category not found' });
        }

        // Find the main goal by ID
        const mainGoal = mainCategory.mainGoals.id(goalId);

        if (!mainGoal) {
            return res.status(404).json({ message: 'Main target goal not found' });
        }

        // Find the index of the sub-target goal
        const subGoalIndex = mainGoal.subGoals.findIndex(subGoal => subGoal._id.toString() === subGoalId);

        if (subGoalIndex === -1) {
            return res.status(404).json({ message: 'Sub-target goal not found' });
        }

        // Remove the sub-target goal from the array
        mainGoal.subGoals.splice(subGoalIndex, 1);

        // Save the updated main category
        await mainCategory.save();

        res.status(200).json({ message: 'Sub-target goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sub-target goal', error: error.message });
    }
};
