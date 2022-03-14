const formatText = require('../utils/formatText')


function parseVerse(queryString, dict) {
    console.log(queryString)
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

    for (i = 0, aa = syllable.reduce((previousValue, currentValue) => previousValue + currentValue); cutter < aa; i++) {


        let tibSlice = []
        for (m = 4; m > 0; m--) {
            let index = formattedArray.slice(0 + cutter, m + cutter).join('')

            tibSlice.push(index)
            tibSlice.push(index.slice(index.length - 3, index.length))
            tibSlice.push(index.slice(index.length - 2, index.length))

        }



        //find the largest tibetan word in the dictionary that matches the text as parsed
        let parsedWord

        for (n = 0; n < 12; n++) {

            //find the cut
            let cut
            if ([0, 1, 2].includes(n)) {
                cut = 4
            } else if ([3, 4, 5].includes(n)) {
                cut = 3
            } else if ([6, 7, 8].includes(n)) {
                cut = 2
            } else(
                cut = 1
            )

            if (dict.find(el => el.alternate.find(element => element === tibSlice[n]))) {
                let parsedWord = dict.find(el => el.alternate.find(element => element === tibSlice[n]))

                createFinalArray(parsedWord, tibSlice[n], lengthArray, cut, 0)
                break

            } else if (dict.find(el => el.alternate.find(element => element === (tibSlice[n].slice(0, tibSlice[n].length - 3) + '་'))) && ((tibSlice[n + 1] == 'འི་' || tibSlice[n + 1] == 'འོ་' || tibSlice[n + 1] == 'འམ་' || tibSlice[n + 1] == 'འང་'))) {
                let parsedWord = dict.find(el => el.alternate.find(element => element === (tibSlice[n].slice(0, tibSlice[n].length - 3) + '་')))

                createFinalArray(parsedWord, tibSlice[n], lengthArray, cut, 3)

                break
            } else if (dict.find(el => el.alternate.find(element => element === (tibSlice[n].slice(0, tibSlice[n].length - 2) + '་'))) && ((tibSlice[n + 2] == 'ར་') || (tibSlice[n + 2] == 'ས་'))) {
                let parsedWord = dict.find(el => el.alternate.find(element => element === (tibSlice[n].slice(0, tibSlice[n].length - 2) + '་')))

                createFinalArray(parsedWord, tibSlice[n], lengthArray, cut, 2)
                break
            } else { n += 2 }
        }



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


    function createFinalArray(word, original, lengthArray, cut, slice, addedA) {

        if (slice === 0) {

            cutter += cut
            let rightStanza = stanzaPicker(cutter, lengthArray[1])
            let rightIndex = word.alternate.findIndex(word => word === original)
            let phonetic = word.phonetic[rightIndex]

            parsedArray.push([original, rightStanza, cutter, phonetic])

            return
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