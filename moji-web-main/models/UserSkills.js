const mongoose = require('mongoose');

const UserSkillsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    passageIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passage',
        required: true,
    }],
});

const UserSkills = mongoose.model('UserSkills', UserSkillsSchema);

module.exports = UserSkills;