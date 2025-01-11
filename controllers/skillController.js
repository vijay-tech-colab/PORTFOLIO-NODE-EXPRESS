const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../middleware/errorClass');
const Skill = require('../models/skillSchema');
const cloudinary = require('cloudinary').v2;

// Controller to handle posting a new skill
exports.postSkill = catchAsyncErrors(async (req, res, next) => {
    // Destructure required fields from request body
    const {
        name, 
        proficiency, 
        description, 
        yearsOfExperience, 
        category
    } = req.body;

    // Check if all required fields are provided
    if (!name || !proficiency || !yearsOfExperience || !description || !category) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    console.log(req.files);
    const { skillIcon } = req.files;

    // Validate skill icon file
    if (!skillIcon || Object.keys(req.files).length === 0 || Object.keys(skillIcon).length === 0) {
        return next(new ErrorHandler("Skill icons are required", 400));
    }

    // Upload skill icon to Cloudinary
    const result = await cloudinary.uploader.upload(skillIcon.tempFilePath, {
        folder: "ICONS"
    });

    // Check if upload was successful
    if (!result) {
        return next(new ErrorHandler("Failed to upload skill icon", 500));
    }

    // Create new skill in the database
    const skill = await Skill.create({
        name, 
        proficiency, 
        description, 
        yearsOfExperience, 
        category,
        skillIcon: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

    // Send response with success status and created skill
    res.status(201).json({
        success: true,
        skill
    });
});

// Controller to handle fetching all skills
exports.getAllSkills = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1; // Current page number
    const limit = parseInt(req.query.limit, 10) || 6; // Number of items per page
    const skip = (page - 1) * limit; // Number of items to skip

    // Get total skill count
    const totalSkills = await Skill.countDocuments();

    // Fetch paginated skills
    const skills = await Skill.find().skip(skip).limit(limit);

    res.status(200).json({
        success: true,
        totalSkills,
        currentPage: page,
        totalPages: Math.ceil(totalSkills / limit),
        skills
    });
});


// Controller to handle fetching a single skill by ID
exports.getSkillById = catchAsyncErrors(async (req, res, next) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }

    res.status(200).json({
        success: true,
        skill
    });
});

// Controller to handle updating a skill by ID
exports.updateSkill = catchAsyncErrors(async (req, res, next) => {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }

    const {
        name, 
        proficiency, 
        description, 
        yearsOfExperience, 
        category
    } = req.body;

    // Update skill fields
    skill.name = name || skill.name;
    skill.proficiency = proficiency || skill.proficiency;
    skill.description = description || skill.description;
    skill.yearsOfExperience = yearsOfExperience || skill.yearsOfExperience;
    skill.category = category || skill.category;

    // Save updated skill to the database
    await skill.save();

    res.status(200).json({
        success: true,
        skill
    });
});

// Controller to handle deleting a skill by ID
exports.deleteSkill = catchAsyncErrors(async (req, res, next) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }

    // Remove skill from the database
    await skill.remove();

    res.status(200).json({
        success: true,
        message: "Skill deleted successfully"
    });
});
