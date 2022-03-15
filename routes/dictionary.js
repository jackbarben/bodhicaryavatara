const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const clean = require('../utils/clean')
const cleanPhonetic = require('../utils/cleanPhonetic')
const { isLoggedIn } = require('../utils/middleware')
const { pool } = require('../utils/databaseConfig')
const { dictionarySchema } = require('../schemas');

const validateDictionary = (req, res, next) => {

    let validatePartial = {
        tibetan: req.body.dictionary.tibetan,
        pos: req.body.dictionary.pos,
        definition: req.body.dictionary.definition,
        alternate: req.body.dictionary.alternate,
        phonetic: req.body.dictionary.phonetic,
    }

    const { error } = dictionarySchema.validate(validatePartial)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isAuthorized = async(req, res, next) => {
    const { authorized } = req.user

    if (authorized === null) {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect('/')
    } else if (authorized.includes('bodhicaryavatara') || authorized.includes('all')) {
        next()

    } else {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect('/')
    }

}


router.get('/', isLoggedIn, isAuthorized, catchAsync(async(req, res) => {

    let tibetanWord = {
        tibetan: '',
        pos: '',
        seealso: '',
        phonetic: '',
        alternate: '',
        definition: '',
        synonyms: '',
        homonyms: '',
        related: ''
    }

    const searchWord = req.query.search
    const lookup = await pool.query(`SELECT * FROM dictionary WHERE '${searchWord}'=ANY(alternate)`)

    if (!lookup.rows[0]) {
        res.render('dictionary', { tibetanWord, searchWord })
    } else {

        try {
            const unparsedObject = await pool.query(`SELECT * FROM dictionary WHERE '${searchWord}'=ANY(alternate)`)
            console.log(unparsedObject)
            tibetanWord.definition = unparsedObject.rows[0].definition
            tibetanWord.alternate = unparsedObject.rows[0].alternate.filter(Boolean);
            tibetanWord.phonetic = unparsedObject.rows[0].phonetic.filter(Boolean)
            tibetanWord.seealso = unparsedObject.rows[0].seealso.filter(Boolean)
            tibetanWord.pos = unparsedObject.rows[0].pos
            tibetanWord.tibetan = unparsedObject.rows[0].tibetan
            tibetanWord.synonyms = unparsedObject.rows[0].synonyms.filter(Boolean)
            tibetanWord.homonyms = unparsedObject.rows[0].homonyms.filter(Boolean)
            tibetanWord.related = unparsedObject.rows[0].related.filter(Boolean)
            res.render('dictionary', { tibetanWord, searchWord })
        } catch {
            tibetanWord = tibetanWord
            res.render('dictionary', { tibetanWord, searchWord })
        }
    }
}))

router.post('/', isLoggedIn, validateDictionary, catchAsync(async(req, res) => {

    let newWord = req.body.dictionary
    const alternate = clean(newWord.alternate)
    const phonetic = cleanPhonetic(newWord.phonetic)
    const seealso = clean(newWord.seealso)
    const synonyms = clean(newWord.synonyms)
    const homonyms = clean(newWord.homonyms)
    const related = clean(newWord.related)

    const deleteText = `DELETE FROM dictionary WHERE tibetan='${newWord.tibetan}'`
    const deletePriorEntry = await pool.query(deleteText)
    const queryText = `INSERT INTO dictionary(tibetan, pos, seealso, alternate, phonetic, definition, synonyms, homonyms, related)VALUES('${newWord.tibetan}','${newWord.pos}',\'{${seealso}}\',\'{${alternate}}\',\'{${phonetic}}\','${newWord.definition}',\'{${synonyms}}\',\'{${homonyms}}\',\'{${related}}\')`
    const tibetanResponse = await pool.query(queryText)
    req.flash('success', "Success!")
    res.redirect('/dictionary')
}))

module.exports = router;