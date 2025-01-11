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
    skillIcon : {
        public_id : {
            type : String,
            required : true
        },
        url : {
            type : String,
            required : true
        }
    },
    description: {
        type: String,
        trim: true, // Allow some space around the description
    },
    yearsOfExperience: {
        type: Number,
        min: 0, // Ensures the experience is a non-negative number
    },
    category: {
        type: String,
        enum: ['Programming', 'Web Development', 'Data Science','Database', 'DevOps', 'Design', 'Others'], // Categorize skills
    }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;

