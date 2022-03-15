const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { pool } = require('../utils/databaseConfig')
const stanzaSyllable = require('../utils/getLengths')
const parseVerseNoDatabase = require('../utils/parseVerseNoDatabase')

let fullDictionary

router.get('/', catchAsync(async(req, res) => {

    let verseNumber = { verse: 1 }
    let chapterNumber = { chapter: 7 }
    try {


        const dictionary = await pool.query(`SELECT * FROM dictionary`)
        fullDictionary = dictionary.rows
        const tibetanLookup = await pool.query(`SELECT tibetan FROM bodhicaryavatara WHERE verse=1 AND chapter=7`)
        const englishLookup = await pool.query(`SELECT english FROM bodhicaryavatara WHERE verse=1 AND chapter=7`)
        const engArray = englishLookup.rows[0].english.split('|')
        const lengths = stanzaSyllable(tibetanLookup.rows[0].tibetan)
        const parsedVerse = await parseVerseNoDatabase(tibetanLookup.rows[0].tibetan, fullDictionary)
        console.log(lengths)
        res.render('home', { parsedVerse, lengths, verseNumber, engArray, chapterNumber })
    } catch (e) {
        console.log(e)
    }

}))





router.post('/', catchAsync(async(req, res) => {
    let verseNumber = { verse: 1 }
    let chapterNumber = { chapter: 7 }
    console.log('here' + req.body.verse)

    try {
        if (req.body.verse) {
            verseNumber.verse = req.body.verse
            chapterNumber.chapter = req.body.chapter || 7

            renderPage(req, res, verseNumber, chapterNumber)

        } else {
            renderPage(req, res, verseNumber, chapterNumber)
        }

    } catch (e) {
        console.log(e)
    }

}))

router.get('/manjushri', catchAsync(async(req, res) => {
    let gangloma = []

    try {
        const lookup = await pool.query('SELECT * FROM gangloma ORDER BY verse')
        const ganglomaRows = lookup.rows

        for (let i = 0; i < 9; i++) {
            console.log(i)
            const ganglomaArray = parseVerseNoDatabase(ganglomaRows[i].tibetan, fullDictionary)
            gangloma.push(ganglomaArray)
        }
        console.log(gangloma)
        console.log(ganglomaRows)
        res.render('manjushri', { gangloma, ganglomaRows })
    } catch (e) {
        console.log(e)
        req.flash("error", "Could not get page");
        res.redirect('/')
    }

}))

async function renderPage(req, res, verseNumber, chapterNumber) {
    let lookup
    try {
        lookup = await pool.query(`SELECT tibetan FROM bodhicaryavatara WHERE verse='${verseNumber.verse}' AND chapter='${chapterNumber.chapter}'`)
        let lengths = stanzaSyllable(lookup.rows[0].tibetan)
        let parsedVerse = await parseVerseNoDatabase(lookup.rows[0].tibetan, fullDictionary)
        let englishLookup = await pool.query(`SELECT english FROM bodhicaryavatara WHERE verse='${verseNumber.verse}' AND chapter='${chapterNumber.chapter}'`)

        if (englishLookup.rows[0].english === null) {
            let engArray = []
            await res.render('home', { parsedVerse, lengths, verseNumber, engArray, chapterNumber })
        } else {
            let engArray = englishLookup.rows[0].english.split('|')
            await res.render('home', { parsedVerse, lengths, verseNumber, engArray, chapterNumber })
        }
    } catch (e) {
        console.log(e)
        req.flash('error', 'No verse found for that selection.')
        res.redirect('/')
    }



}

module.exports = router