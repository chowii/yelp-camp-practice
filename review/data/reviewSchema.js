const Joi = require('joi')

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required(),
        rating: Joi.number().required()
            .min(0)
            .max(5)
    }).required()
})
