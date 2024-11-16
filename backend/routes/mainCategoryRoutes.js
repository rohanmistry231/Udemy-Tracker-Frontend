const express = require('express');
const router = express.Router();
const {
    createMainCategory,
    updateMainCategory,
    deleteMainCategory,
    createMainTargetGoal,
    updateMainTargetGoal,
    deleteMainTargetGoal,
    createSubTargetGoal,
    updateSubTargetGoal,
    deleteSubTargetGoal,
    getMainCategories
} = require('../controller/mainCategoryController');

// Fetch all main categories
router.get('/', getMainCategories);

// Routes for Main Categories
router.post('/', createMainCategory); // Create a main category
router.put('/:categoryId', updateMainCategory); // Update a main category
router.delete('/:categoryId', deleteMainCategory); // Delete a main category

// Routes for Main Target Goals
router.post('/:categoryId/main-goal', createMainTargetGoal); // Create a main target goal
router.put('/:categoryId/main-goal/:goalId', updateMainTargetGoal); // Update a main target goal
router.delete('/:categoryId/main-goal/:goalId', deleteMainTargetGoal); // Delete a main target goal

// Routes for Sub Target Goals
router.post('/:categoryId/main-goal/:goalId/sub-goal', createSubTargetGoal); // Create a sub-target goal
router.put('/:categoryId/main-goal/:goalId/sub-goal/:subGoalId', updateSubTargetGoal); // Update a sub-target goal
router.delete('/:categoryId/main-goal/:goalId/sub-goal/:subGoalId', deleteSubTargetGoal); // Delete a sub-target goal

module.exports = router;
