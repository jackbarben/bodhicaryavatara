const nextArrow = document.getElementById('next-arrow')
const prevArrow = document.getElementById('prev-arrow')

const verseNumber = document.getElementById('verse-number-value')
const chapterNumber = document.getElementById('chapter-number-value')

const nextChapter = document.getElementById('next-chapter-number')
const nextVerse = document.getElementById('next-verse-number')
const nextForm = document.getElementById('next-form')

const prevChapter = document.getElementById('prev-chapter-number')
const prevVerse = document.getElementById('prev-verse-number')
const prevForm = document.getElementById('prev-form')

nextArrow.addEventListener('click', (e) => {
    e.preventDefault()
    nextVerse.value = (Number(verseNumber.value)) + 1
    nextChapter.value = chapterNumber.value
    nextForm.submit()
})

prevArrow.addEventListener('click', (e) => {
    e.preventDefault()
    if (Number(verseNumber.value) === 1) {
        prevVerse.value = 1
        prevChapter.value = chapterNumber.value
        prevForm.submit()
    } else {
        prevVerse.value = (Number(verseNumber.value)) - 1
        prevChapter.value = chapterNumber.value
        console.log(prevVerse.value)
        prevForm.submit()
    }

})

const tibetanOn = document.getElementById('tibetan-on')
const englishOn = document.getElementById('english-on')
const phoneticOn = document.getElementById('phonetic-on')
const tibetanLine = document.querySelectorAll('.tibetan-line')
const englishLine = document.querySelectorAll('.english-line')
const phoneticLine = document.querySelectorAll('.phonetic-line')


tibetanOn.addEventListener('click', function(e) {

    for (i = 0; i < 8; i++) {
        if (tibetanLine[i].style.visibility === '') {
            tibetanLine[i].style.visibility = 'hidden'
            tibetanOn.style.opacity = '.3'
            tibetanLine[i].style.height = 0
        } else {
            tibetanLine[i].style.visibility = ''
            tibetanOn.style.opacity = '1'
            tibetanLine[i].style.height = '100%'
        }

    }
})

englishOn.addEventListener('click', function(e) {
    for (i = 0; i < 8; i++) {
        if (englishLine[i].style.visibility === '') {
            englishLine[i].style.visibility = 'hidden'
            englishOn.style.opacity = '.3'
            englishLine[i].style.height = 0

        } else {
            englishLine[i].style.visibility = ''
            englishOn.style.opacity = '1'
            englishLine[i].style.height = '100%'
        }

    }
})

phoneticOn.addEventListener('click', function(e) {
    for (i = 0; i < 8; i++) {
        if (phoneticLine[i].style.visibility === '') {
            phoneticLine[i].style.visibility = 'hidden'
            phoneticOn.style.opacity = '.3'
            phoneticLine[i].style.height = 0
        } else {
            phoneticLine[i].style.visibility = ''
            phoneticOn.style.opacity = '1'
            phoneticLine[i].style.height = '100%'

        }

    }
})




//Socket.io
var socket = io();



const input = document.getElementById('tib-verse-container')
const seeAlsoText = document.getElementById('see-also')
const spanList = document.getElementsByTagName('span')

input.addEventListener('click', function(event) {
    const inner = event.target.innerText

    if (event.target.tagName != "SPAN") return;
    socket.emit('dictionary', inner);
});


socket.on('connect', () => {
    console.log('Connected to the Main Room')

})

socket.on('dictionary', function(word, msg) {
    seeAlsoText.innerText = ''
    translatedWord.innerText = msg
    typeSpeech.innerHTML = word[0].pos
    blankTranslation.innerHTML = word[0].definition
    for (i = 0; i < word[0].seealso.length; i++) {
        const newSpan = document.createElement('span')
        newSpan.innerText = `${word[0].seealso[i]} `
        seeAlsoText.append(newSpan)
    }
    const newSpan = document.createElement('span')
    newSpan.innerText = msg
    seeAlsoText.append(newSpan)
});


seeAlsoText.addEventListener('click', (event) => {
    const inner = event.target.innerText
    socket.emit('seeAlso', inner)
})

const seeAlsoDiv = document.getElementById('test-div')
socket.on('seeAlso', (word, msg) => {

    translatedWord.innerText = msg
    typeSpeech.innerHTML = word[0].pos
    blankTranslation.innerHTML = word[0].definition
    const spanArrLength = document.getElementById('see-also').getElementsByTagName('span').length
    const spanArrList = document.getElementById('see-also').getElementsByTagName('span')
    let spanArray = []


    for (i = 0; i < spanArrLength; i++) {
        const spanInner = spanArrList[i].innerText
        const removeSpaces = spanInner.trim()
        spanArray.push(removeSpaces)
    }

    for (i = 0; i < word[0].seealso.length; i++) {
        if (spanArray.includes(word[0].seealso[i])) {

        } else {
            const newSpan = document.createElement('span')
            newSpan.innerText = `${word[0].seealso[i]} `
            seeAlsoText.append(newSpan)
            seeAlsoDiv.innerText = `${word[0].seealso[i]} `
        }

    }
})



function addShas() {
    for (i = 1; i < tibetanLine.length; i++) {
        if (document.querySelector(`.tib${i}`).lastElementChild) {
            const replacement = document.querySelector(`.tib${i}`).lastElementChild.innerText
            if (replacement.slice(replacement.length - 2, replacement.length).includes('ག་')) {
                const replacement1 = replacement.slice(0, replacement.length - 1).concat('།')
                document.querySelector(`.tib${i}`).lastElementChild.innerText = replacement1
            } else if (replacement.slice(replacement.length - 3, replacement.length).includes('གི་')) {
                const replacement1 = replacement.slice(0, replacement.length - 1).concat('།')
                document.querySelector(`.tib${i}`).lastElementChild.innerText = replacement1
            } else {
                const replacement1 = replacement.slice(0, replacement.length - 1).concat('༎')
                document.querySelector(`.tib${i}`).lastElementChild.innerText = replacement1
            }

        }

    }
}

window.onload = addShas()