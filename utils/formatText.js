function formatText(queryString) {
    let parsedArray = []
    const removeSpaces = queryString.replace(/\s+/g, '')
    const afterGsort1 = removeSpaces.replace('གི།', 'གི་')
    const afterGsort2 = afterGsort1.replace('ག།', 'ག་')
    const afterGsort3 = afterGsort2.replace(/་།/g, '།')
    const tibetanString = afterGsort3.replace(/།།/g, '་')
    const preSortArray = tibetanString.replace('།', '')
    const sortArray = preSortArray.split('་')
    sortArray.push('')
    const removeSpace = []
    for (let i of sortArray)
        i && removeSpace.push(i)

    for (i = 0; i < 8; i++) {
        removeSpace.push('empty')
    }
    let almostFinalArray = removeSpace.map(i => i + '་')
    return almostFinalArray
}

module.exports = formatText