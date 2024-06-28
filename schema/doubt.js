const Joi = require("joi");

module.exports.doubtSchema = Joi.object({
    doubt: Joi.object({
        image: Joi.alternatives().try(
            Joi.array().items(Joi.string().pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/)).required()
        ),
        class: Joi.string().required(),
        title: Joi.string().required(),
        subject: Joi.string().required(),
        topic: Joi.string().required(),
        createdAt: Joi.date().default(Date.now),
        teacher: Joi.string().required(),
        student: Joi.string().required(),
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
    }).required()
}).required()