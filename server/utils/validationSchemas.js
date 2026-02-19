const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    // profilePic is handled by multer, not in req.body usually, 
    // but if we want to validate other fields we can.
});

const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    signupSchema,
    signinSchema
};
