const sounds = {
    beep: '../assets/beep.mp3',
    newBeep: '../assets/new_beep.mp3',
    bell: '../assets/bell.mp3'
}

export function playSound(sound: 'beep' | 'newBeep' | 'bell') {
    const audio = new Audio(sounds[sound]);
    audio.play();
}