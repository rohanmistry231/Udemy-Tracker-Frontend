let dataCache = {}; // Cache to avoid refetching frequently

// Get Courses from localStorage or fetch from backend if not present
export async function initializeData() {
  if (!localStorage.getItem('udemyCourses')) {
    const udemyCourses = await fetch('https://udemy-tracker.vercel.app/courses').then((res) => res.json());
    localStorage.setItem('udemyCourses', JSON.stringify(udemyCourses));
  }
  dataCache.udemyCourses = JSON.parse(localStorage.getItem('udemyCourses'));
}

// Get Courses and Notes from localStorage
export function getCourses() {
  return dataCache.udemyCourses || JSON.parse(localStorage.getItem('udemyCourses'));
}

export function getNotes() {
  const courses = getCourses();
  return courses.flatMap(course => course.notes);
}

// Add new course to the list (both frontend and backend)
export async function addCourse(course) {
  const udemyCourses = getCourses();
  udemyCourses.push(course);
  localStorage.setItem('udemyCourses', JSON.stringify(udemyCourses)); // Save to localStorage

  await fetch('https://udemy-tracker.vercel.app/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
}

// Add new note to a course (both frontend and backend)
export async function addNoteToCourse(courseId, note) {
  const udemyCourses = getCourses();
  const course = udemyCourses.find(course => course._id === courseId);
  if (course) {
    course.notes.push(note); // Add note to the course
    localStorage.setItem('udemyCourses', JSON.stringify(udemyCourses)); // Save to localStorage

    await fetch(`https://udemy-tracker.vercel.app/courses/${courseId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
  }
}

// Update a course in both localStorage and backend
export async function updateCourse(courseId, updatedCourseData) {
  const udemyCourses = getCourses();
  const courseIndex = udemyCourses.findIndex(course => course._id === courseId);

  if (courseIndex !== -1) {
    udemyCourses[courseIndex] = { ...udemyCourses[courseIndex], ...updatedCourseData };
    localStorage.setItem('udemyCourses', JSON.stringify(udemyCourses)); // Save to localStorage

    await fetch(`https://udemy-tracker.vercel.app/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourseData),
    });
  }
}

// Update a note in a course (both frontend and backend)
export async function updateNoteInCourse(courseId, noteId, updatedNoteData) {
  const udemyCourses = getCourses();
  const course = udemyCourses.find(course => course._id === courseId);
  
  if (course) {
    const noteIndex = course.notes.findIndex(note => note._id === noteId);
    
    if (noteIndex !== -1) {
      course.notes[noteIndex] = { ...course.notes[noteIndex], ...updatedNoteData };
      localStorage.setItem('udemyCourses', JSON.stringify(udemyCourses)); // Save to localStorage

      await fetch(`https://udemy-tracker.vercel.app/courses/${courseId}/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNoteData),
      });
    }
  }
}

// Delete a course from localStorage and backend
export async function deleteCourse(courseId) {
  const udemyCourses = getCourses();
  const updatedCourses = udemyCourses.filter(course => course._id !== courseId);
  localStorage.setItem('udemyCourses', JSON.stringify(updatedCourses)); // Save to localStorage

  await fetch(`https://udemy-tracker.vercel.app/courses/${courseId}`, {
    method: 'DELETE',
  });
}

// Delete a note from a course (both frontend and backend)
export async function deleteNoteFromCourse(courseId, noteId) {
  const udemyCourses = getCourses();
  const course = udemyCourses.find(course => course._id === courseId);
  
  if (course) {
    const updatedNotes = course.notes.filter(note => note._id !== noteId);
    course.notes = updatedNotes; // Remove note from the course
    localStorage.setItem('udemyCourses', JSON.stringify(udemyCourses)); // Save to localStorage

    await fetch(`https://udemy-tracker.vercel.app/courses/${courseId}/notes/${noteId}`, {
      method: 'DELETE',
    });
  }
}

// Sync courses and notes with backend (called every hour)
export async function syncWithBackend() {
  const udemyCourses = getCourses();

  await fetch('https://udemy-tracker.vercel.app/courses/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(udemyCourses), // Send all courses and notes data
  });
}

setInterval(syncWithBackend, 60 * 60 * 1000); // Sync every hour
