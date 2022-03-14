function clean(word) {
    let final = []
    for (i = 0; i < 11; i++) {
        let noSpace = word[i].replace(/\s+/g, '')
        if (noSpace === '') {
        } else {
            final.push(noSpace)
        }
    }
    return final
}

module.exports = clean