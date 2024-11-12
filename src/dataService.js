// dataService.js

const BASE_URL = "https://udemy-tracker.vercel.app/courses"; // Your API base URL

// Helper function to get courses from local storage
function getCoursesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("courses")) || [];
}

// Helper function to save courses to local storage
function saveCoursesToLocalStorage(courses) {
  localStorage.setItem("courses", JSON.stringify(courses));
}

// Function to update a note in local storage
function updateNoteInLocalStorage(courseId, noteId, updatedNote) {
  let courses = getCoursesFromLocalStorage();
  const course = courses.find((course) => course._id === courseId);

  if (course) {
    const note = course.notes.find((note) => note._id === noteId);
    if (note) {
      note.question = updatedNote.question;
      note.answer = updatedNote.answer;
      saveCoursesToLocalStorage(courses);
    }
  }
}

// Function to sync the updated note with the backend
async function syncNoteWithBackend(courseId, noteId, updatedNote) {
  const url = `${BASE_URL}/${courseId}/notes/${noteId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: updatedNote.question,
        answer: updatedNote.answer,
      }),
    });
    const data = await response.json();
    console.log("Sync successful:", data);
    return data;
  } catch (error) {
    console.error("Error syncing with backend:", error);
    throw error;
  }
}

// Function to auto-sync the note after 1 hour (3600000ms)
function autoSyncNote(courseId, noteId, updatedNote) {
  // Save the updated note in local storage
  updateNoteInLocalStorage(courseId, noteId, updatedNote);

  // Set a timer to auto-sync after 1 hour
  setTimeout(() => {
    syncNoteWithBackend(courseId, noteId, updatedNote);
  }, 3600000); // 1 hour in milliseconds
}

// Function to create a new course and store it in local storage
function createCourseInLocalStorage(course) {
  let courses = getCoursesFromLocalStorage();
  courses.push(course);
  saveCoursesToLocalStorage(courses);
}

// Function to create a new course and sync with backend
async function createCourse(courseData) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });
    const data = await response.json();
    // Save course in local storage
    createCourseInLocalStorage(data);
    return data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

// Function to get all courses from backend
async function getCoursesFromBackend() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

// Function to get a specific course by ID from backend
async function getCourseById(courseId) {
  const url = `${BASE_URL}/${courseId}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

// Function to update a course in local storage and sync with the backend
async function updateCourse(courseId, courseData) {
  let courses = getCoursesFromLocalStorage();
  const courseIndex = courses.findIndex((course) => course._id === courseId);

  if (courseIndex !== -1) {
    // Update the course in local storage
    courses[courseIndex] = { ...courses[courseIndex], ...courseData };
  } else {
    // Add course only if it doesn't already exist
    courses.push({ _id: courseId, ...courseData });
  }

  // Remove any duplicate entries by creating a Set based on `_id`
  const uniqueCourses = Array.from(new Map(courses.map((course) => [course._id, course])).values());

  // Save the unique courses back to local storage
  saveCoursesToLocalStorage(uniqueCourses);

  // Sync the updated course with the backend
  const url = `${BASE_URL}/${courseId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      throw new Error("Failed to update course in backend");
    }

    const updatedCourse = await response.json();

    // Update local storage with the backend response to ensure consistency
    uniqueCourses[courseIndex] = updatedCourse;
    saveCoursesToLocalStorage(uniqueCourses);

    return updatedCourse;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}


// Function to sync courses between local storage and the backend
async function syncCoursesWithBackend() {
  try {
    // Fetch the latest courses from the backend
    const backendCourses = await getCoursesFromBackend();

    // Get the courses from local storage
    let localCourses = getCoursesFromLocalStorage();

    // Compare and update the local courses with the backend courses
    // First, keep the courses from the backend
    backendCourses.forEach((backendCourse) => {
      const index = localCourses.findIndex(
        (localCourse) => localCourse._id === backendCourse._id
      );

      // If the course exists locally, update it, otherwise add it to the local courses
      if (index !== -1) {
        localCourses[index] = backendCourse; // Update the course
      } else {
        localCourses.push(backendCourse); // Add the new course from backend
      }
    });

    // Now, remove any courses from local storage that no longer exist in the backend
    localCourses = localCourses.filter((localCourse) =>
      backendCourses.some(
        (backendCourse) => backendCourse._id === localCourse._id
      )
    );

    // Save the updated courses back to local storage
    saveCoursesToLocalStorage(localCourses);

    console.log("Courses successfully synced with the backend!");
    return localCourses;
  } catch (error) {
    console.error("Error syncing courses with backend:", error);
    throw error;
  }
}

// Function to fetch notes from the backend API
export async function getNotesFromBackend() {
  try {
    const response = await fetch("https://udemy-tracker.vercel.app/notes/all");
    if (!response.ok) {
      throw new Error("Failed to fetch notes from the backend");
    }

    const data = await response.json();
    return data.notes; // Assuming the response structure contains 'notes'
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}
// Function to sync notes between local storage and the backend
export async function syncNotesWithBackend() {
  try {
    // Fetch the latest notes from the backend
    const backendNotes = await getNotesFromBackend();

    // Get the notes from local storage
    let localNotes = getNotesFromLocalStorage();

    // Compare and update the local notes with the backend notes
    backendNotes.forEach((backendNote) => {
      const index = localNotes.findIndex(
        (localNote) => localNote._id === backendNote._id
      );

      // If the note exists locally, update it, otherwise add it to the local notes
      if (index !== -1) {
        localNotes[index] = backendNote; // Update the note
      } else {
        localNotes.push(backendNote); // Add the new note from backend
      }
    });

    // Now, remove any notes from local storage that no longer exist in the backend
    localNotes = localNotes.filter((localNote) =>
      backendNotes.some((backendNote) => backendNote._id === localNote._id)
    );

    // Save the updated notes back to local storage
    saveNotesToLocalStorage(localNotes);

    console.log("Notes successfully synced with the backend!");
    return localNotes;
  } catch (error) {
    console.error("Error syncing notes with backend:", error);
    throw error;
  }
}

// Function to update a note in the backend
async function updateNote(courseId, noteId, updatedNote) {
  const url = `${BASE_URL}/${courseId}/notes/${noteId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedNote),
  });

  if (!response.ok) {
    throw new Error("Failed to update note");
  }

  const data = await response.json();
  return data;
}

// Function to get notes from localStorage
export const getNotesFromLocalStorage = () => {
  try {
    // Try to parse notes from localStorage
    const notes = JSON.parse(localStorage.getItem("notes"));

    // If notes exist in localStorage, return them; otherwise return an empty array
    return notes || [];
  } catch (error) {
    console.error("Error retrieving notes from localStorage:", error);
    return []; // Return an empty array if there was an error during parsing
  }
};

// Function to save notes to localStorage
export const saveNotesToLocalStorage = (notes) => {
  try {
    // Save notes as a JSON string in localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to localStorage:", error);
  }
};

// Function to fetch the course name from the backend
export const getCourseName = async (id) => {
  try {
    const response = await fetch(
      `https://udemy-tracker.vercel.app/courses/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch course data");
    }
    const data = await response.json();
    return data.name; // Assuming 'name' is the property containing the course name
  } catch (error) {
    console.error("Error fetching course name:", error);
    throw error; // Optionally rethrow or return a default value
  }
};

// Function to add a note to a course
export const addNoteToCourse = async (id, noteData) => {
  try {
    const response = await fetch(
      `https://udemy-tracker.vercel.app/courses/${id}/notes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add note");
    }
    return await response.json(); // Return response data if needed
  } catch (error) {
    console.error("Error adding note:", error);
    throw error; // Rethrow error for the calling function to handle
  }
};

// Function to fetch note details by id
export const fetchNoteById = async (id) => {
  try {
    const response = await fetch(
      `https://udemy-tracker.vercel.app/notes/note/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch note details");
    }
    return await response.json(); // Return the note data
  } catch (error) {
    console.error("Error fetching note:", error);
    throw error; // Rethrow the error to be handled in the component
  }
};

// Function to get course details from localStorage
export const getCourseDetails = (courseId) => {
  try {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const course = courses.find((course) => course._id === courseId);

    if (!course) {
      throw new Error("Course not found in localStorage");
    }

    return {
      name: course.name, // Course name
      mainCategory: course.category, // Main category associated with the course
      targetGoal: course.subCategory, // Target goal (sub-category) associated with the course
    };
  } catch (error) {
    console.error("Error fetching course details from localStorage:", error);
    throw error;
  }
};

// Exporting functions to be used in your components
export {
  getCoursesFromLocalStorage,
  saveCoursesToLocalStorage,
  updateNoteInLocalStorage,
  syncNoteWithBackend,
  autoSyncNote,
  createCourse,
  getCoursesFromBackend,
  getCourseById,
  updateCourse,
  syncCoursesWithBackend,
  updateNote,
};
