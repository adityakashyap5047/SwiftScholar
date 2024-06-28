const Joi = require("joi");

module.exports.studentSchema = Joi.object({
    student: Joi.object({
        name: Joi.string().required(),
        profileImage: Joi.string().required(),
        class: Joi.string().required(),
        school: Joi.string().required(),
        contactNo: Joi.string().pattern(/^[0-9]{10}$/).required(),
        emailId: Joi.string().email().required(),
        username: Joi.string().required(),
        doubts: Joi.array().items(Joi.object({
            doubt: Joi.string().required(),
            teacher: Joi.string().required(),
            solution: Joi.array().items(Joi.object({
                image: Joi.alternatives().try(
                    Joi.array().items(Joi.string().pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/)).required()
                ),
                suggestion: Joi.string().required()
            })).optional(),
            review: Joi.array().items(Joi.object({
                rating: Joi.number().min(1).max(5).required(),
                comments: Joi.string().required(),
                createdAt: Joi.date().default(Date.now)
            })).optional()
        })).optional()
    }).required(),
    password: Joi.string().required(),
    type: Joi.string().default("Student").required(),
    role: Joi.string().default("student").optional()
});