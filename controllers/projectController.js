const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../middleware/errorClass");
const Project = require("../models/projectSchema");
const cloudinary = require("cloudinary").v2;

// Add a new project
exports.addProject = catchAsyncErrors(async (req, res, next) => {
    const { title, description, liveLink, repoLink, technologies } = req.body;
    
    // Check if all required fields are provided
    if (!title || !description || !liveLink || !repoLink || !technologies) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    
    // Check if project icon is provided
    if (!req.files || Object.keys(req.files).length === 0 || Object.keys(req.files.projectIcon).length === 0) {
        return next(new ErrorHandler("Project icon is required", 400));
    }
    
    const { projectIcon } = req.files;
    // Upload project icon to Cloudinary
    const result = await cloudinary.uploader.upload(projectIcon.tempFilePath, {
        folder: "PROJECTS"
    });

    if (!result) {
        return next(new ErrorHandler("Failed to upload project icon", 500));
    }

    // Create a new project
    const project = await Project.create({
        title,
        description,
        liveLink,
        repoLink,
        technologies: technologies.split(","),
        projectIcon: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

    // Send response
    res.status(201).json({
        success: true,
        project
    });
});

// Get all projects with pagination
exports.getProjects = catchAsyncErrors(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const totalProjects = await Project.countDocuments();
    const projects = await Project.find().skip(skip).limit(limit);

    // Send response
    res.status(200).json({
        success: true,
        totalProjects,
        currentPage: page,
        projects
    });
});

// Get a single project by ID
exports.getProject = catchAsyncErrors(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    // Send response
    res.status(200).json({
        success: true,
        project
    });
});

// Update a project by ID
exports.updateProject = catchAsyncErrors(async (req, res, next) => {
    // Find the project by ID
    const project = await Project.findById(req.params.id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    // Prepare updated data
    const updatedData = {};
    const { title, description, liveLink, repoLink, technologies } = req.body;
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (liveLink) updatedData.liveLink = liveLink;
    if (repoLink) updatedData.repoLink = repoLink;
    if (technologies) updatedData.technologies = technologies.split(",");

    // Check if a new project icon is provided
    if (req.files && Object.keys(req.files).length > 0 && Object.keys(req.files.projectIcon).length > 0) {
        // Delete the old project icon from Cloudinary
        await cloudinary.uploader.destroy(project.projectIcon.public_id);

        // Upload the new project icon to Cloudinary
        const { projectIcon } = req.files;
        const result = await cloudinary.uploader.upload(projectIcon.tempFilePath, {
            folder: "PROJECTS"
        });

        if (!result) {
            return next(new ErrorHandler("Failed to upload project icon", 500));
        }

        // Update project icon data
        updatedData.projectIcon = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    // Update the project with new data
    const newProject = await Project.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    // Send response
    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        project: newProject
    });
});

// Delete a project by ID
exports.deleteProject = catchAsyncErrors(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    // Delete the project icon from Cloudinary
    await cloudinary.uploader.destroy(project.projectIcon.public_id);
    // Remove the project from the database
    await project.remove();

    // Send response
    res.status(200).json({
        success: true,
        message: "Project deleted successfully"
    });
});
