import { media } from "./data/media.js"
import { getRndNumber } from "./utils/functions.js"

const cards = [...document.querySelectorAll('.card')],
    library = document.querySelector('.disc-library'),
    arrows = [...document.querySelectorAll('.arrow')],
    player = [...document.querySelectorAll('[aria-hidden]')],
    exitPlayer = document.querySelector('.exit'),
    playlist = document.querySelector('.playlist'),
    mediaInfos = [],
    soundtracks = [],
    audio = new Audio

let angle = 0,
    chgtCard = 0,
    canChange = true, //prevent spam
    prevX,
    prevY,
    timeElapsed = 50,
    genreSelected,
    genreWrapper,
    play = false,
    trackIndex = 0,
    random = false


window.onload = animateCards()

// first card animation when the page is loaded
function animateCards() {
    cards.forEach((card, idx) => {
        setTimeout(function () {

            let divClassName

            if (idx % 2 === 0) {
                divClassName = "card-from-left"
            }
            else {
                divClassName = "card-from-right"
            }

            card.classList.remove(divClassName)
            setTimeout(function () {
                card.classList.add("card-centered")
            }, 150 + cards.length * 150)
        }, timeElapsed)

        timeElapsed += 150
    })
}

function changeCard(direction) {
    // direction : -1 => left / 1 => right

    canChange = false

    cards.forEach(card => {

        let pos = + card.dataset.pos
        let newPos = pos + direction

        card.dataset.pos = newPos

        if (newPos === 0) {
            setTimeout(function () {
                card.dataset.pos = 8
                canChange = true
            }, 500)
        }
        else if (newPos === 9) {
            setTimeout(function () {
                card.dataset.pos = 1
                canChange = true
            }, 500)
        }
    })
}


// -A- change cards with wheel
library.addEventListener('wheel', e => {

    if (canChange) {
        const direction = Math.sign(e.deltaY)
        chgtCard += direction

        Math.abs(chgtCard) > 5 && (
            changeCard(direction),
            chgtCard = 0)
    }
})


// -B- change cards with touches
library.addEventListener('touchstart', (e) => {
    prevX = e.touches[0].clientX
    prevY = e.touches[0].clientY
})

library.addEventListener('touchmove', (e) => {
    e.preventDefault()
    if (canChange) {
        let direction
        let newX = e.touches[0].clientX
        let newY = e.touches[0].clientY
        let deltaX = Math.abs(newX - prevX)
        let deltaY = Math.abs(newY - prevY)
        if (deltaX > 10 || deltaY > 10) {
            deltaX > deltaY ? (direction = Math.sign(newX - prevX),
                prevX = newX)
                : (direction = Math.sign(newY - prevY),
                    prevY = newY)
            changeCard(direction)
        }
    }
})

// -C- change cards with arrows
arrows.forEach(arrow => arrow.addEventListener('click', e => canChange && changeCard(parseInt(e.target.dataset.dir))))


// Part II - select an album
cards.forEach(card => card.addEventListener('click', e => {
    // cards.forEach(card => card !== genreSelected && (card.style.opacity = "0"))
    console.log('click on', e.target.dataset.genre)
    // aria selected = true
    genreWrapper = e.target
    genreSelected = e.target.dataset.genre

    mediaInfos.length = 0
    mediaInfos.push(...media[genreSelected])

    playlist.innerHTML = ''

    mediaInfos.forEach((media, idx) => {
        playlist.innerHTML += `
        <div class="soundtrack" aria-selected="false">
        <div>
        ${idx + 1} 
        </div>
        artist: ${media.artist}
        <div>
        </div>
        title: ${media.title}
        <div>
        </div>
        <div>
        `
    })

    soundtracks.length = 0
    soundtracks.push(...Array.from(document.querySelectorAll('.soundtrack')))

    soundtracks.forEach((track, idx) => track.addEventListener('click', () => {
        trackIndex = idx
        playMusik()
    }))

    genreWrapper.setAttribute('aria-selected', true)
    player.forEach(elt => elt.setAttribute("aria-hidden", false))
    setTimeout(() => { playMusik() }, 500)
}))

exitPlayer.addEventListener('click', () => {
    setTimeout(() => {
        genreWrapper.setAttribute('aria-selected', false)
    }, 500)

    player.forEach(elt => elt.setAttribute("aria-hidden", true))

    stopMusik()
})


//Part III Music player
const playBtn = document.querySelector('.play'),
    changeTrackBtn = Array.from(document.querySelectorAll('.change-track')),
    pauseBtn = document.querySelector('.pause'),
    stopBtn = document.querySelector('.stop'),
    randomBtn = document.querySelector('.random')

playBtn.addEventListener('click', !play && playMusik)
pauseBtn.addEventListener('click', pauseMusik)
stopBtn.addEventListener('click', stopMusik)

randomBtn.addEventListener('click', () => random = !random)

changeTrackBtn.forEach(btn => btn.addEventListener('click', e => changeTrack(+e.target.dataset.value)))

function playMusik() {
    soundtracks.forEach(track => track.setAttribute('aria-selected', false))
    soundtracks[trackIndex].setAttribute('aria-selected', true)

    audio.src = `../assets/music/${genreSelected}/${mediaInfos[trackIndex].title}-${mediaInfos[trackIndex].artist}.mp3`
    audio.play()
}

function pauseMusik() {
    pause ? audio.pause() : audio.play()
    pause = !pause
}

function stopMusik() {
    audio.pause()
    audio.currentTime = 0
    trackIndex = 0
}

function changeTrack(value) {
    if (random) {
        pickNextRndTrack()
    }
    else {
        trackIndex += value
        trackIndex < 0 && (trackIndex = mediaInfos.length - 1)
        trackIndex === mediaInfos.length && (trackIndex = 0)
    }
    playMusik()
}

audio.addEventListener('ended', () => changeTrack(1))

function pickNextRndTrack() {
    let rndTrack
    do { rndTrack = getRndNumber(mediaInfos.length) }
    while (rndTrack === trackIndex)
    trackIndex = rndTrack
}
