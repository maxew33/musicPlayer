import { media } from "./data/media.js"
import { getRndNumber } from "./utils/functions.js"

const discs = [...document.querySelectorAll('.disc')],
    library = document.querySelector('.disc-library'),
    arrows = [...document.querySelectorAll('.arrow')],
    player = [...document.querySelectorAll('.player-elt')],
    exitPlayer = document.querySelector('.exit'),
    mediaInfos = [],
    audio = new Audio,
    trackInfos = document.querySelector('.track-infos')

let chgtdisc = 0,
    canChange = true, //prevent spam
    prevX,
    prevY,
    timeElapsed = 50,
    genreSelected,
    genreWrapper,
    pause = false,
    trackIndex = 0,
    playingType = "straight",
    albumOpened = false

window.onload = animatediscs()

console.log(`
_                       
|_)  _   _  o  _       _ 
|_) (_) | | | (_) |_| |  
          _|            
     \\_________/
     
`)

// first disc animation when the page is loaded
function animatediscs() {
    discs.forEach((disc, idx) => {
        setTimeout(function () {

            let divClassName

            if (idx % 2 === 0) {
                divClassName = "disc-from-left"
            }
            else {
                divClassName = "disc-from-right"
            }

            disc.classList.remove(divClassName)

        }, timeElapsed)

        timeElapsed += 150
    })
}

function changedisc(direction) {
    // direction : -1 => left / 1 => right

    canChange = false

    discs.forEach(disc => {

        let pos = + disc.dataset.pos
        let newPos = pos + direction

        disc.dataset.pos = newPos

        if (newPos === 0) {
            setTimeout(function () {
                disc.dataset.pos = 8
                canChange = true
            }, 500)
        }
        else if (newPos === 9) {
            setTimeout(function () {
                disc.dataset.pos = 1
                canChange = true
            }, 500)
        }
    })
}

// -A- change discs with wheel
library.addEventListener('wheel', e => {

    if (canChange) {
        const direction = Math.sign(e.deltaY)
        chgtdisc += direction

        Math.abs(chgtdisc) > 5 && (
            changedisc(direction),
            chgtdisc = 0)
    }
})


// -B- change discs with touches
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
            changedisc(direction)
        }
    }
})

// -C- change discs with arrows
arrows.forEach(arrow => arrow.addEventListener('click', e => canChange && changedisc(parseInt(e.target.dataset.dir))))


// Part II - select an album
discs.forEach(disc => disc.addEventListener('click', e => {

    albumOpened ? closeAlbum() : openAlbum(e)
    
}))

exitPlayer.addEventListener('click', closeAlbum)

function openAlbum(e){
    
    genreWrapper = e.target
    genreSelected = e.target.dataset.genre

    mediaInfos.length = 0
    mediaInfos.push(...media[genreSelected])

    genreWrapper.setAttribute('aria-selected', true)
    player.forEach(elt => elt.setAttribute("aria-hidden", false))
    setTimeout(() => { playMusik() }, 500)

    albumOpened = true
}

function closeAlbum(){
    setTimeout(() => {
        genreWrapper.setAttribute('aria-selected', false)
    }, 500)

    player.forEach(elt => elt.setAttribute("aria-hidden", true))

    trackInfos.innerText=''

    stopMusik()

    albumOpened = false
}

//Part III Music player
const playBtn = document.querySelector('.play'),
    changeTrackBtn = Array.from(document.querySelectorAll('.change-track')),
    pauseBtn = document.querySelector('.pause'),
    stopBtn = document.querySelector('.stop'),
    playingTypeBtns  =Array.from(document.querySelectorAll('.playing-type-btn')),
    setVolumeBtn = Array.from(document.querySelectorAll('.set-volume')),
    volumeValue = document.querySelector('.volume-value')

playBtn.addEventListener('click', pauseMusik)
pauseBtn.addEventListener('click', pauseMusik)
stopBtn.addEventListener('click', stopMusik)

playingTypeBtns.forEach(btn => btn.addEventListener('click', e => {
    playingType = e.target.dataset.next
    btn.setAttribute('aria-selected', false)
    document.querySelector(`[data-id=${e.target.dataset.next}]`).setAttribute('aria-selected', true)
}))

changeTrackBtn.forEach(btn => btn.addEventListener('click', e => changeTrack(+e.target.dataset.value)))

setVolumeBtn.forEach(btn => btn.addEventListener('click', e => setVolume(+e.target.dataset.value)))

function playMusik() {

    volumeValue.innerHTML=Math.round(audio.volume*10)

    audio.src = `./assets/music/${genreSelected}/${mediaInfos[trackIndex].path}`
    audio.play()

    trackInfos.innerText = `${trackIndex < 10 && '0'}${trackIndex+1} - ${mediaInfos[trackIndex].artist} - ${mediaInfos[trackIndex].title}`

    pause = false
    displayPlayBtn()
}

function pauseMusik() {

    pause ? audio.play() : audio.pause()
    pause = !pause

    displayPlayBtn()
}

function displayPlayBtn() {
    pauseBtn.style.display = pause ? 'none' : 'block'
    playBtn.style.display = pause ? 'block' : 'none'
}

function stopMusik() {
    audio.pause()
    audio.currentTime = 0
    trackIndex = 0
    pause = true
    
    displayPlayBtn()
}

function changeTrack(value) {
    if (playingType === "random") {
        pickNextRndTrack()
    }
    else {
        playingType === "repeat" &&(value = 0)
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

function setVolume(value){
    let currentVolume = audio.volume
    currentVolume += value*0.1
    currentVolume < 0 && (currentVolume = 0)
    currentVolume > 1 && (currentVolume = 1)
    audio.volume = currentVolume
    volumeValue.innerHTML=Math.round(audio.volume*10)
}