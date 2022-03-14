const stanzaSyllable = function (queryString) {
    let stanzaLength = queryString.split('།').filter(word => word.length > 3).length
    let verseNumFind = queryString.split('།').filter(word => word.length > 3)
    let verseNumFind2 = verseNumFind[0].split('་')
    let syllable = verseNumFind2.filter(word => word.length > 0).length
    let final = {
        stanza: stanzaLength,
        syllable: syllable
    }
    return final
}

module.exports = stanzaSyllable
