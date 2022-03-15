const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const cleanVerse = require('../utils/cleanVerse');
const { isLoggedIn } = require('../utils/middleware')
const { pool } = require('../utils/databaseConfig')
const { versesSchema } = require('../schemas')

const validateVerses = (req, res, next) => {
    let validatePartial = { verse1: req.body.verse1 }
    const { error } = versesSchema.validate(validatePartial)

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

    let englishVerse = '1'
    let englishChapter = '8'
    if (Object.keys(req.query).length === 0) {

    } else {
        englishVerse = req.query.verse
        englishChapter = req.query.chapter
    }
    const tibetanLookup = await pool.query(`SELECT tibetan FROM bodhicaryavatara WHERE verse='${englishVerse}' AND chapter='${englishChapter}'`)
    const englishLookup = await pool.query(`SELECT english FROM bodhicaryavatara WHERE verse='${englishVerse}' AND chapter='${englishChapter}'`)
    const removeSpaces = tibetanLookup.rows[0].tibetan.replace(/\s+/g, '')
    const tibetanVerse = removeSpaces.split('།')
    if (englishLookup.rows[0].english === null) {
        let engArray = []
        res.render('verse', { engArray, englishVerse, englishChapter, tibetanVerse })
    } else {
        let engArray = englishLookup.rows[0].english.split('|')
        res.render('verse', { engArray, englishVerse, englishChapter, tibetanVerse })
    }


}))

router.post('/', isLoggedIn, validateVerses, catchAsync(async(req, res) => {

    let engArray = ['', '', '', '', '', '']
    let tibetanVerse = ''
    let englishVerse = req.body.verseNumber
    let englishChapter = req.body.chapterNumber
    const updatedVerse = cleanVerse(req.body)
    const updateVerse = await pool.query(`UPDATE bodhicaryavatara set english = '${updatedVerse}' WHERE verse='${englishVerse}' AND chapter='${englishChapter}'`)
    req.flash('success', "Successfully Entered Verse!")
    res.redirect('/verse')
}))

module.exports = router;