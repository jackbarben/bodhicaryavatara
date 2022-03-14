const formatText = require('../utils/formatText')

const { pool } = require('../utils/databaseConfig')

async function parseVerse(queryString) {

    let parsedArray = []
    let fullArray = []
    const formattedArray = formatText(queryString)

    //These variables decipher the length of the stanza, verse, etc for display on page.
    let syllable = []
    let stanzaLength = queryString.split('།').filter(word => word.length > 3).length
    let verseNumFind = queryString.split('།').filter(word => word.length > 3)

    for (i = 0; i < stanzaLength; i++) {
        let first = verseNumFind[i].split('་')
        let second = first.filter(word => word.length > 0).length
        syllable.push(second)
    }
    lengthArray = [stanzaLength, syllable]

    //grab slices of tibetan text separated at the tseg in order to figure out which word to parse
    let cutter = 0;

    for (i = 0; cutter < formattedArray.length; i++) {

        let fourthSlice = formattedArray.slice(0 + cutter, 4 + cutter).join('')
        let firstSlice = formattedArray.slice(0 + cutter, 3 + cutter).join('')
        let secondSlice = formattedArray.slice(0 + cutter, 2 + cutter).join('')
        let thirdSlice = formattedArray.slice(0 + cutter, 1 + cutter).join('')

        let fourThree = fourthSlice.slice(fourthSlice.length - 3, fourthSlice.length)
        let fourTwo = fourthSlice.slice(fourthSlice.length - 2, fourthSlice.length)
        let oneThree = firstSlice.slice(firstSlice.length - 3, firstSlice.length)
        let oneTwo = firstSlice.slice(firstSlice.length - 2, firstSlice.length)

        let twoThree = secondSlice.slice(secondSlice.length - 3, secondSlice.length)
        let twoTwo = secondSlice.slice(secondSlice.length - 2, secondSlice.length)

        let threeThree = thirdSlice.slice(thirdSlice.length - 3, thirdSlice.length)
        let threeTwo = thirdSlice.slice(thirdSlice.length - 2, thirdSlice.length)


        //The commented out code was my original code before trying to speed up database calls.  I don't know for certain that it works in all cases, so I've left it as is for now.

        // const slice1 = await pool.query(`SELECT * FROM dictionary WHERE '${fourthSlice}' = ANY (alternate)`)
        // const slice2 = await pool.query(`SELECT * FROM dictionary WHERE '${fourthSlice.slice(0, fourthSlice.length - 3) + '་'}' = ANY (alternate)`)
        // const slice3 = await pool.query(`SELECT * FROM dictionary WHERE '${fourthSlice.slice(0, fourthSlice.length - 2) + '་'}' = ANY (alternate)`)
        // const slice3A = await pool.query(`SELECT * FROM dictionary WHERE '${fourthSlice.slice(0, fourthSlice.length - 2) + 'འ་'}' = ANY (alternate)`)
        // const slice4 = await pool.query(`SELECT * FROM dictionary WHERE '${firstSlice}' = ANY (alternate)`)
        // const slice5 = await pool.query(`SELECT * FROM dictionary WHERE '${firstSlice.slice(0, firstSlice.length - 3) + '་'}' = ANY (alternate)`)
        // const slice6 = await pool.query(`SELECT * FROM dictionary WHERE '${firstSlice.slice(0, firstSlice.length - 2) + '་'}' = ANY (alternate)`)
        // const slice6A = await pool.query(`SELECT * FROM dictionary WHERE '${firstSlice.slice(0, firstSlice.length - 2) + 'འ་'}' = ANY (alternate)`)
        // const slice7 = await pool.query(`SELECT * FROM dictionary WHERE '${secondSlice}' = ANY (alternate)`)
        // const slice8 = await pool.query(`SELECT * FROM dictionary WHERE '${secondSlice.slice(0, secondSlice.length - 3) + '་'}' = ANY (alternate)`)
        // const slice9 = await pool.query(`SELECT * FROM dictionary WHERE '${secondSlice.slice(0, secondSlice.length - 2) + '་'}' = ANY (alternate)`)
        // const slice9A = await pool.query(`SELECT * FROM dictionary WHERE '${secondSlice.slice(0, secondSlice.length - 2) + 'འ་'}' = ANY (alternate)`)
        // const slice10 = await pool.query(`SELECT * FROM dictionary WHERE '${thirdSlice}' = ANY (alternate)`)
        // const slice11 = await pool.query(`SELECT * FROM dictionary WHERE '${thirdSlice.slice(0, thirdSlice.length - 3) + '་'}' = ANY (alternate)`)
        // const slice12 = await pool.query(`SELECT * FROM dictionary WHERE '${thirdSlice.slice(0, thirdSlice.length - 2) + '་'}' = ANY (alternate)`)
        // const slice12A = await pool.query(`SELECT * FROM dictionary WHERE '${thirdSlice.slice(0, thirdSlice.length - 2) + 'འ་'}' = ANY (alternate)`)




        let grabSlice = await pool.query(`SELECT 1 as a, * FROM dictionary WHERE '${fourthSlice}' = ANY (alternate)
        UNION ALL
        SELECT 2 as a, * FROM dictionary WHERE '${fourthSlice.slice(0, fourthSlice.length - 3) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 3 as a, * FROM dictionary WHERE '${fourthSlice.slice(0, fourthSlice.length - 2) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 4 as a, * FROM dictionary WHERE '${firstSlice}' = ANY (alternate)
        UNION ALL
        SELECT 5 as a, * FROM dictionary WHERE '${firstSlice.slice(0, firstSlice.length - 3) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 6 as a, * FROM dictionary WHERE '${firstSlice.slice(0, firstSlice.length - 2) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 7 as a, * FROM dictionary WHERE '${secondSlice}' = ANY (alternate)
        UNION ALL
        SELECT 8 as a, * FROM dictionary WHERE '${secondSlice.slice(0, secondSlice.length - 3) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 9 as a, * FROM dictionary WHERE '${secondSlice.slice(0, secondSlice.length - 2) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 10 as a, * FROM dictionary WHERE '${thirdSlice}' = ANY (alternate)
        UNION ALL
        SELECT 11 as a, * FROM dictionary WHERE '${thirdSlice.slice(0, thirdSlice.length - 3) + '་'}' = ANY (alternate)
        UNION ALL
        SELECT 12 as a, * FROM dictionary WHERE '${thirdSlice.slice(0, thirdSlice.length - 2) + '་'}' = ANY (alternate)
        `)
        let allRows = grabSlice.rows

        let grabSlice2 = []
        let putTogether = []

        //parse the text
        for (j = 0; j < allRows.length; j++) {
            const stringer = allRows[j]
            grabSlice2.push(stringer)
            const columner = JSON.stringify(allRows[j].a).split('')
            const columning = parseInt(columner.join(''))

            putTogether.push(columning)
        }

        if (putTogether[0] === 1) {

            createFinalArray(grabSlice2[0], fourthSlice, lengthArray, 4, 0)

        } else if (putTogether[1] === 1) {
            createFinalArray(grabSlice2[1], fourthSlice, lengthArray, 4, 0)

        } else if (putTogether[2] === 1) {
            createFinalArray(grabSlice2[2], fourthSlice, lengthArray, 4, 0)

        } else if (putTogether[0] === 2 && (fourThree == 'འི་' || fourThree == 'འོ་' || fourThree == 'འམ་' || fourThree == 'འང་')) {
            createFinalArray(grabSlice2[0], fourthSlice, lengthArray, 4, 3)
        } else if (putTogether[1] === 2 && (fourThree == 'འི་' || fourThree == 'འོ་' || fourThree == 'འམ་' || fourThree == 'འང་')) {
            createFinalArray(grabSlice2[1], fourthSlice, lengthArray, 4, 3)
        } else if (putTogether[2] === 2 && (fourThree == 'འི་' || fourThree == 'འོ་' || fourThree == 'འམ་' || fourThree == 'འང་')) {
            createFinalArray(grabSlice2[2], fourthSlice, lengthArray, 4, 3)
        } else if (putTogether[0] === 3 && (fourTwo == 'ར་' || fourTwo == 'ས་')) {
            createFinalArray(grabSlice2[0], fourthSlice, lengthArray, 4, 2)
        } else if (putTogether[1] === 3 && (fourTwo == 'ར་' || fourTwo == 'ས་')) {
            createFinalArray(grabSlice2[1], fourthSlice, lengthArray, 4, 2)
        } else if (putTogether[2] === 3 && (fourTwo == 'ར་' || fourTwo == 'ས་')) {
            createFinalArray(grabSlice2[2], fourthSlice, lengthArray, 4, 2)
        } else if (putTogether[0] === 4) {
            createFinalArray(grabSlice2[0], firstSlice, lengthArray, 3, 0)
        } else if (putTogether[1] === 4) {
            createFinalArray(grabSlice2[1], firstSlice, lengthArray, 3, 0)
        } else if (putTogether[2] === 4) {
            createFinalArray(grabSlice2[2], firstSlice, lengthArray, 3, 0)
        } else if (putTogether[0] === 5 && (oneThree == 'འི་' || oneThree == 'འོ་' || oneThree == 'འམ་' || oneThree == 'འང་')) {
            createFinalArray(grabSlice2[0], firstSlice, lengthArray, 3, 3)
        } else if (putTogether[1] === 5 && (oneThree == 'འི་' || oneThree == 'འོ་' || oneThree == 'འམ་' || oneThree == 'འང་')) {
            createFinalArray(grabSlice2[1], firstSlice, lengthArray, 3, 3)
        } else if (putTogether[2] === 5 && (oneThree == 'འི་' || oneThree == 'འོ་' || oneThree == 'འམ་' || oneThree == 'འང་')) {
            createFinalArray(grabSlice2[2], firstSlice, lengthArray, 3, 3)
        } else if (putTogether[0] === 6 && (oneTwo == 'ར་' || oneTwo == 'ས་')) {
            createFinalArray(grabSlice2[0], firstSlice, lengthArray, 3, 2)
        } else if (putTogether[1] === 6 && (oneTwo == 'ར་' || oneTwo == 'ས་')) {
            createFinalArray(grabSlice2[1], firstSlice, lengthArray, 3, 2)
        } else if (putTogether[2] === 6 && (oneTwo == 'ར་' || oneTwo == 'ས་')) {

            createFinalArray(grabSlice2[2], firstSlice, lengthArray, 3, 2)
        } else if (putTogether[0] === 7) {

            createFinalArray(grabSlice2[0], secondSlice, lengthArray, 2, 0)
        } else if (putTogether[1] === 7) {
            createFinalArray(grabSlice2[1], secondSlice, lengthArray, 2, 0)
        } else if (putTogether[2] === 7) {
            createFinalArray(grabSlice2[2], secondSlice, lengthArray, 2, 0)
        } else if (putTogether[0] === 8 && (twoThree == 'འི་' || twoThree == 'འོ་' || twoThree == 'འམ་' || twoThree == 'འང་')) {
            createFinalArray(grabSlice2[0], secondSlice, lengthArray, 2, 3)
        } else if (putTogether[1] === 8 && (twoThree == 'འི་' || twoThree == 'འོ་' || twoThree == 'འམ་' || twoThree == 'འང་')) {
            createFinalArray(grabSlice2[1], secondSlice, lengthArray, 2, 3)
        } else if (putTogether[2] === 8 && (twoThree == 'འི་' || twoThree == 'འོ་' || twoThree == 'འམ་' || twoThree == 'འང་')) {
            createFinalArray(grabSlice2[2], secondSlice, lengthArray, 2, 3)
        } else if (putTogether[0] === 9 && (twoTwo == 'ར་' || twoTwo == 'ས་')) {
            createFinalArray(grabSlice2[0], secondSlice, lengthArray, 2, 2)
        } else if (putTogether[1] === 9 && (twoTwo == 'ར་' || twoTwo == 'ས་')) {
            createFinalArray(grabSlice2[1], secondSlice, lengthArray, 2, 2)
        } else if (putTogether[2] === 9 && (twoTwo == 'ར་' || twoTwo == 'ས་')) {
            createFinalArray(grabSlice2[2], secondSlice, lengthArray, 2, 2)
        } else if (putTogether[0] === 10) {
            createFinalArray(grabSlice2[0], thirdSlice, lengthArray, 1, 0)
        } else if (putTogether[1] === 10) {
            createFinalArray(grabSlice2[1], thirdSlice, lengthArray, 1, 0)
        } else if (putTogether[2] === 10) {
            createFinalArray(grabSlice2[2], thirdSlice, lengthArray, 1, 0)
        } else if (putTogether[0] === 11 && (threeThree == 'འི་' || threeThree == 'འོ་' || threeThree == 'འམ་' || threeThree == 'འང་')) {
            createFinalArray(grabSlice2[0], thirdSlice, lengthArray, 1, 3)
        } else if (putTogether[1] === 11 && (threeThree == 'འི་' || threeThree == 'འོ་' || threeThree == 'འམ་' || threeThree == 'འང་')) {
            createFinalArray(grabSlice2[1], thirdSlice, lengthArray, 1, 3)
        } else if (putTogether[2] === 11 && (threeThree == 'འི་' || threeThree == 'འོ་' || threeThree == 'འམ་' || threeThree == 'འང་')) {
            createFinalArray(grabSlice2[2], thirdSlice, lengthArray, 1, 3)
        } else if (putTogether[0] === 12 && (threeTwo == 'ར་' || threeTwo == 'ས་')) {
            createFinalArray(grabSlice2[0], thirdSlice, lengthArray, 1, 2)
        } else if (putTogether[1] === 12 && (threeTwo == 'ར་' || threeTwo == 'ས་')) {
            createFinalArray(grabSlice2[1], thirdSlice, lengthArray, 1, 2)
        } else if (putTogether[2] === 12 && (threeTwo == 'ར་' || threeTwo == 'ས་')) {
            createFinalArray(grabSlice2[2], thirdSlice, lengthArray, 1, 2)
        } else {
            cutter = 1000
        }


        // if (slice1.rowCount > 0) {
        //     createFinalArray(slice1.rows[0], fourthSlice, lengthArray, 4, 0)

        // } else if (slice2.rowCount > 0 && (fourThree == 'འི་' || fourThree == 'འོ་' || fourThree == 'འམ་' || fourThree == 'འང་')) {
        //     createFinalArray(slice2.rows[0], fourthSlice, lengthArray, 4, 3)

        // } else if (slice3.rowCount > 0 && (fourTwo == 'ར་' || fourTwo == 'ས་')) {
        //     createFinalArray(slice3.rows[0], fourthSlice, lengthArray, 4, 2)


        // } else if (slice4.rowCount > 0) {
        //     createFinalArray(slice4.rows[0], firstSlice, lengthArray, 3, 0)

        // } else if (slice5.rowCount > 0 && (oneThree == 'འི་' || oneThree == 'འོ་' || oneThree == 'འམ་' || oneThree == 'འང་')) {
        //     createFinalArray(slice5.rows[0], firstSlice, lengthArray, 3, 3)

        // } else if (slice6.rowCount > 0 && (oneTwo == 'ར་' || oneTwo == 'ས་')) {
        //     createFinalArray(slice6.rows[0], firstSlice, lengthArray, 3, 2)


        // } else if (slice7.rowCount > 0) {
        //     createFinalArray(slice7.rows[0], secondSlice, lengthArray, 2, 0)

        // } else if (slice8.rowCount > 0 && (twoThree == 'འི་' || twoThree == 'འོ་' || twoThree == 'འམ་' || twoThree == 'འང་')) {
        //     createFinalArray(slice8.rows[0], secondSlice, lengthArray, 2, 3)

        // } else if (((slice9.rowCount > 0 || slice9A.rowCount > 0)) && (twoTwo == 'ར་' || twoTwo == 'ས་')) {

        //     createFinalArray(slice9.rows[0], secondSlice, lengthArray, 2, 2, slice9A.rows[0])


        // } else if (slice10.rowCount > 0) {

        //     createFinalArray(slice10.rows[0], thirdSlice, lengthArray, 1, 0)

        // } else if (slice11.rowCount > 0 && (threeThree == 'འི་' || threeThree == 'འོ་' || threeThree == 'འམ་' || threeThree == 'འང་')) {
        //     createFinalArray(slice11.rows[0], thirdSlice, lengthArray, 1, 3)

        // } else if (slice12.rowCount > 0 && (threeTwo == 'ར་' || threeTwo == 'ས་')) {
        //     createFinalArray(slice12.rows[0], thirdSlice, lengthArray, 1, 2)

        // } else {

        // }
    }

    function phoneticFind(word, ending) {
        let phonEnding
        let phonFull
        let phonWord = word.concat('་')
        if (ending === 'འི་') {
            phonEnding = 'i'
        } else if (ending === 'འོ་') {
            phonEnding = 'o'
        } else if (ending === 'འམ་') {
            phonEnding = 'am'
        } else if (ending === 'འང་') {
            phonEnding = 'ang'
        } else if (ending === 'ར་') {
            phonEnding = 'r'
        } else if (ending === 'ས་') {
            phonEnding = 's'
        } else {
            phonEnding = ''
        }
        let final = [phonEnding, phonWord]
        return final
    }


    async function createFinalArray(word, original, lengthArray, cut, slice, addedA) {

        if (slice === 0) {

            cutter += cut
            let rightStanza = stanzaPicker(cutter, lengthArray[1])
            let rightIndex = word.alternate.findIndex(word => word === original)
            let phonetic = word.phonetic[rightIndex]

            parsedArray.push([original, rightStanza, cutter, phonetic])

        } else if (slice === 3) {

            cutter += cut
            let rightStanza = stanzaPicker(cutter, lengthArray[1])
            const ending = original.slice(original.length - 3, original.length)
            const tibetanWord = original.slice(0, original.length - 3)
            const phoneticArray = phoneticFind(tibetanWord, ending)
            let rightIndex = word.alternate.findIndex(word => word === phoneticArray[1])
            let phonetic = word.phonetic[rightIndex].concat(phoneticArray[0])
            let phonetic2 = ''

            parsedArray.push([tibetanWord, rightStanza, cutter, phonetic])
            parsedArray.push([ending, rightStanza, cutter, phonetic2])

        } else if (slice === 2) {

            cutter += cut
            let rightStanza = stanzaPicker(cutter, lengthArray[1])
            if (typeof addedA !== 'undefined') {

                const ending = original.slice(original.length - 2, original.length)
                const tibetanWord = original.slice(0, original.length - 2)
                const phoneticA = `${tibetanWord}འ`
                const phoneticArray = phoneticFind(phoneticA, ending)


                let rightIndex = addedA.alternate.findIndex(word => word === phoneticArray[1])

                let phonetic = addedA.phonetic[rightIndex].concat(phoneticArray[0])
                let phonetic2 = ''

                parsedArray.push([tibetanWord, rightStanza, cutter, phonetic])
                parsedArray.push([ending, rightStanza, cutter, phonetic2])

            } else {


                const ending = original.slice(original.length - 2, original.length)
                const tibetanWord = original.slice(0, original.length - 2)
                const phoneticArray = phoneticFind(tibetanWord, ending)


                let rightIndex = word.alternate.findIndex(word => word === phoneticArray[1])
                let phonetic = word.phonetic[rightIndex].concat(phoneticArray[0])
                let phonetic2 = ''

                parsedArray.push([tibetanWord, rightStanza, cutter, phonetic])
                parsedArray.push([ending, rightStanza, cutter, phonetic2])
            }
        }
    }

    function stanzaPicker(cutter, syllable) {
        let stanza
        if (cutter <= syllable[0]) {
            stanza = 1
            return stanza
        } else if (cutter <= (syllable[1] + syllable[0])) {
            stanza = 2
            return stanza
        } else if (cutter <= (syllable[2] + syllable[1] + syllable[0])) {
            stanza = 3
            return stanza
        } else if (cutter <= (syllable[3] + syllable[2] + syllable[1] + syllable[0])) {
            stanza = 4
            return stanza
        } else if (cutter <= (syllable[4] + syllable[3] + syllable[2] + syllable[1] + syllable[0])) {
            stanza = 5
            return stanza
        } else if (cutter <= (syllable[5] + syllable[4] + syllable[3] + syllable[2] + syllable[1] + syllable[0])) {
            stanza = 6
            return stanza
        } else if (cutter <= (syllable[6] + syllable[5] + syllable[4] + syllable[3] + syllable[2] + syllable[1] + syllable[0])) {
            stanza = 7
            return stanza
        } else if (cutter <= (syllable[7] + syllable[6] + syllable[5] + syllable[4] + syllable[3] + syllable[2] + syllable[1] + syllable[0])) {
            stanza = 8
            return stanza
        } else {
            return
        }

    }


    return parsedArray
}


module.exports = parseVerse