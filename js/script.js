const cards = [...document.querySelectorAll('.card')],
    library = document.querySelector('.disc-library'),
    arrows = [...document.querySelectorAll('.arrow')],
    player = [...document.querySelectorAll('[aria-hidden]')],
    exitPlayer = document.querySelector('.exit')

let angle = 0,
    chgtCard = 0,
    canChange = true, //prevent spam
    prevX,
    prevY,
    timeElapsed = 50,
    genreSelected

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
    genreSelected = e.target
    // cards.forEach(card => card !== genreSelected && (card.style.opacity = "0"))
    console.log('click on', e.target.dataset.genre)
    // aria selected = true
    genreSelected = e.target
    genreSelected.setAttribute('aria-selected', true)
    player.forEach(elt => elt.setAttribute("aria-hidden", false))
}))

exitPlayer.addEventListener('click', () => {
    setTimeout(() => {
        genreSelected.setAttribute('aria-selected', false)
    }, 500)

    player.forEach(elt => elt.setAttribute("aria-hidden", true))
})