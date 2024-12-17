import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  classes: [],
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    addClass: (state, action) => {
      state.classes.push(action.payload);
    },
    updateClass: (state, action) => {
      const index = state.classes.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    removeClass: (state, action) => {
      state.classes = state.classes.filter((c) => c.id !== action.payload);
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    removeCourse: (state, action) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setCourses,
  setClasses,
  addClass,
  updateClass,
  removeClass,
  addCourse,
  updateCourse,
  removeCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
