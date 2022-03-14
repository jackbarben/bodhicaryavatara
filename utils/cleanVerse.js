function cleanVerse(word) {
    let final = []
    const verse = Object.entries(word)
    for (i = 0; i < 6; i++) {
        if (verse[i][1] === '' || verse[i][0] === "verseNumber") {

        } else {

            const removeSpace = verse[i][1].trim()
            if (removeSpace.includes("'")) {
                const aposReplace = verse[i][1].replace("'", "''")
                final.push(aposReplace)
            } else {
                final.push(removeSpace)
            }


        }
    }

    const stringIt = final.join('|')
    return stringIt
}

module.exports = cleanVerse