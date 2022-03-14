const Joi = require('joi')

const dictionarySchema = Joi.object({
    tibetan: Joi.string().required(),
    pos: Joi.string().required(),
    alternate: Joi.array().required(),
    phonetic: Joi.array().required(),
    definition: Joi.string().required()
}).required()

module.exports.dictionarySchema = dictionarySchema

const versesSchema = Joi.object({
    verse1: Joi.string().required()
    // verse2: Joi.string(),
    // verse3: Joi.string(),
    // verse4: Joi.string(),
    // verse5: Joi.string(),
    // verse6: Joi.string(),
    // verseNumber: Joi.string(),
    // ChapterNumber: Joi.string()
})

module.exports.versesSchema = versesSchema

