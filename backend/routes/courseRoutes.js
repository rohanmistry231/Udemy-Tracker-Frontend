const express = require('express');
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require('../controller/courseController');
const noteRoutes = require('./noteRoutes');

const router = express.Router();

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Mount the notes routes
router.use('/:courseId/notes', noteRoutes);

// Route to get course by ID along with notes
router.get('/:id/notes', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('notes');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
