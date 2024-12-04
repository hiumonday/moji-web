import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    error: null,
    notes: [],
    updatedNotes: null
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setDetailsLoader: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        removeNote: (state, action) => {
            const passageId = action.payload;
            const noteIndex = state.notes.findIndex(note => note.passages.some(passage => passage._id === passageId));
            if (noteIndex > -1) {
                state.notes.splice(noteIndex, 1);
            }
        },
        updateNotes: (state, action) => {
            const { noteId, passageId, updates } = action.payload;
            const note = state.notes.find(note => note.id === noteId);
            if (note) {
                const passage = note.passages.find(passage => passage.id === passageId);
                if (passage) {
                    Object.assign(passage, updates);
                }
            }
        },
        updateLocalNotes: (state, action) => {
            state.notes = action.payload;
        },
        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        setUsersWithNotesCount: (state, action) => {
            state.usersWithNotesCount = action.payload;
        }
    },
});

export const { setDetailsLoader, setError, clearError, setNotes, addNote, updateNotes, removeNote, updateLocalNotes, setUsersWithNotesCount } = notesSlice.actions;

export default notesSlice.reducer;