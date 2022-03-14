function cleanPhonetic(word) {

    let final = []
    for (i = 0; i < 11; i++) {

        let notSpace = word[i]
        let noSpace = notSpace.trim()
        if (noSpace === '') {
        } else {
            final.push(noSpace.trim())
        }
    }

    return final
}

module.exports = cleanPhonetic