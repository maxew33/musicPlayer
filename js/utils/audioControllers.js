function Play(playlist, index){
    audio.src = `../music/${playlist[index].title} - ${playlist[index].artist}.mp3`
    audio.play()
    return true
}