const Joi = require("joi");

module.exports.solutionSchema = Joi.object({
    solution: Joi.object({
        image: Joi.alternatives().try(
            Joi.array().items(Joi.string().pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/)).required()
        ),
        suggestion: Joi.string().required()
    }).required()
}).required()