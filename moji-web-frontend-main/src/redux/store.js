import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import userReducer from "./slices/userSlice";
import testReducer from "./slices/testSlice";
import examReducer from "./slices/examSlice";
import summaryReducer from "./slices/summarizeSlice";  // Import the summaryReducer
import dailySummaryReducer from "./slices/dailySummarizeSlice";
import notesReducer from "./slices/notesSlice"
import ghostReducer from "./slices/ghostSlice";

const reducer = {
  appState: appReducer,
  userState: userReducer,
  testState: testReducer,
  examState: examReducer,
  summaryState: summaryReducer,  // Add the summaryReducer
  dailySummaryState: dailySummaryReducer,
  notesState: notesReducer,
  ghostState: ghostReducer
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
