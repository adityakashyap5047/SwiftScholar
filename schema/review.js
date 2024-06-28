const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comments: Joi.string().required(),
        createdAt: Joi.date().default(Date.now)
    }).required()
}).required()