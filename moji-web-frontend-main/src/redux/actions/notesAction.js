import axios from "axios";
import {
  setDetailsLoader,
  setNotes,
  updateNotes,
  removeNote,
  addNote,
  setUsersWithNotesCount,
} from "../slices/notesSlice";
import { setSuccess, setError } from "../slices/appSlice";
const dotenv = require("dotenv");

export const createNote = (noteData) => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    const { data } = await axios.post(
      process.env.REACT_APP_API_URL + `/api/v1/notes`,
      noteData,
      {
        withCredentials: true,
      }
    );

    dispatch(setDetailsLoader(false));
    dispatch(addNote(data.data));
    dispatch(setSuccess("Note added succesfully"));
  } catch (err) {
    // console.log(err)
    dispatch(setDetailsLoader(false));
    dispatch(setError(err));
  }
};

export const getNotes = () => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `/api/v1/notes`,
      {
        withCredentials: true,
      }
    );
    dispatch(setNotes(data.data));
    dispatch(setDetailsLoader(false));
  } catch (err) {
    dispatch(setDetailsLoader(false));
    dispatch(setError(err));
  }
};

export const getNote = (id) => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `/api/v1/notes/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(setDetailsLoader(false));
  } catch (err) {
    dispatch(setDetailsLoader(false));
    dispatch(setError(err));
  }
};
export const updateNote = (passageId, passageData) => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    const { data } = await axios.put(
      process.env.REACT_APP_API_URL + `/api/v1/notes/${passageId}`,
      passageData,
      {
        withCredentials: true,
      }
    );
    dispatch(updateNotes({ passageId, updates: passageData }));
    dispatch(setDetailsLoader(false));
  } catch (err) {
    dispatch(setDetailsLoader(false));
    dispatch(setError(err));
  }
};

export const deleteNote = (id) => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    await axios.delete(process.env.REACT_APP_API_URL + `/api/v1/notes/${id}`, {
      withCredentials: true,
    });
    dispatch(removeNote(id)); // Dispatch the action to remove the note from the state
    dispatch(setDetailsLoader(false));
    dispatch(setSuccess("Note deleted successfully"));
  } catch (err) {
    dispatch(setDetailsLoader(false));
    dispatch(setError(err));
  }
};

export const getNotesByUserId = (userId) => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `/api/v1/user/${userId}`,
      {
        withCredentials: true,
      }
    );
    dispatch(setNotes(data.data));
    dispatch(setDetailsLoader(false));
  } catch (err) {
    dispatch(setDetailsLoader(false));
    // dispatch(setError(err));
  }
};

export const getUsersWithNotesCount = () => async (dispatch) => {
  try {
    dispatch(setDetailsLoader(true));
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `/api/v1/counter`,
      {
        withCredentials: true,
      }
    );
    // console.log(data)
    dispatch(setUsersWithNotesCount(data.data));
    dispatch(setDetailsLoader(false));
  } catch (err) {
    dispatch(setDetailsLoader(false));
  }
};
