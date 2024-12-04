const Notes = require('../models/Notes');

const createNote = async (req, res) => {
    try {
        const note = new Notes({ user: req.user.id, passages: req.body });
        await note.save();
        res.status(201).json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getNote = async (req, res) => {
    try {
        const note = await Notes.findOne({ 'passages._id': req.params.id });
        if (!note) {
            return res.status(404).json({ success: false, error: 'No passage found' });
        }
        const passage = note.passages.id(req.params.id);
        res.status(200).json({ success: true, data: passage });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateNote= async (req, res) => {
    try {
        console.log(req.params)
        const note = await Notes.findOne({ 'passages._id': req.params.id });
        if (!note) {
            return res.status(404).json({ success: false, error: 'No passage found' });
        }
        console.log(note)

        const passage = note.passages.id(req.params.id);
        passage.set(req.body);
        await note.save();

        res.status(200).json({ success: true, data: passage });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const deleteNote = async (req, res) => {
    try {
        // Find the note containing the passage
        const note = await Notes.findOne({ 'passages._id': req.params.id });

        if (!note) {
            return res.status(404).json({ success: false, error: 'No note found' });
        }

        // Delete the note
        await Notes.findByIdAndDelete(note._id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error.message });
    }
};

const getNotesByUserId = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.params.userId });
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUsersWithNotesCount = async (req, res) => {
    try {
        const usersWithNotesCount = await Notes.aggregate([
            { $group: { _id: "$user", count: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $sort: { count: -1 } }, // Add this line
            { $project: { _id: 0, user: "$user", count: 1 } }
        ]);

        res.status(200).json({ success: true, data: usersWithNotesCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    getUsersWithNotesCount,
    getNotesByUserId
};