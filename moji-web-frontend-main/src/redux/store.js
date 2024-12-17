import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import appReducer from "./slices/appSlice";
import courseReducer from "./slices/courseSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    appState: appReducer,
    course: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
