const Joi = require("joi");

module.exports.adminSchema = Joi.object({
    admin: Joi.object({
        name: Joi.string().required(),
        profileImage: Joi.string().required(),
        contactNo: Joi.string().pattern(/^[0-9]{10}$/).required(),
        emailId: Joi.string().email().required(),
        username: Joi.string().required(),
        passkey: Joi.string().required(),
        securityCode: Joi.string().required(),
    }),
    password: Joi.string().required(),
    type: Joi.string().default("Admin").required(),
    role: Joi.string().default("admin").optional(),
});

