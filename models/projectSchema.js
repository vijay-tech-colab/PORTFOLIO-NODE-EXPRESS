const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    liveLink: {
        type: String, // Live project link
        trim: true,
    },
    repoLink: {
        type: String, // GitHub repo link
        trim: true,
    },
    technologies: [
        {
            type: String, // List of technologies
            trim: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
