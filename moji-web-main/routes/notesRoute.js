const express = require("express");
const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    getNotesByUserId,
    getUsersWithNotesCount
} = require("../controllers/notesController.js");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/notes")
    .get(isAuthenticatedUser, getNotes)
    .post(isAuthenticatedUser, createNote);

router.route("/notes/:id")
    .get(isAuthenticatedUser, getNote)
    .put(isAuthenticatedUser, updateNote)
    .delete(isAuthenticatedUser, deleteNote);

router.route('/user/:userId')
    .get(isAuthenticatedUser, getNotesByUserId);

router.route('/counter')
    .get(isAuthenticatedUser, getUsersWithNotesCount);

module.exports = router;