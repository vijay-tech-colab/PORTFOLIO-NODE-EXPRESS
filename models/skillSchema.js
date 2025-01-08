const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'], // Skill levels
        default: 'Beginner',
    },
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
