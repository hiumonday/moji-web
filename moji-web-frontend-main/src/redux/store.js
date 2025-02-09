import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import appReducer from "./slices/appSlice";
import courseReducer from "./slices/courseSlice";
import classReducer from "./slices/classSlice";
import myCourseReducer from "./slices/myCourseSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    appState: appReducer,
    course: courseReducer,
    class: classReducer,
    myCourse: myCourseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
