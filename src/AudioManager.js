// @flow

import type {SoundName} from "./types"

type AudioLookupTable = {
    forward1: Audio,
    forward2: Audio,
    forward3: Audio,
    left45: Audio,
    left90: Audio,
    left180: Audio,
    right45: Audio,
    right90: Audio,
    right180: Audio,
    add: Audio,
    deleteAll: Audio,
    delete: Audio,
    moveToPrevious: Audio,
    moveToNext: Audio,
    replace: Audio
}

export default class AudioManager {
    audioEnabled: boolean;
    audioLookUpTable: AudioLookupTable;

    constructor(audioEnabled: boolean) {
        this.audioEnabled = audioEnabled;
        this.audioLookUpTable = {
            forward1: new Audio('/audio/Move.wav'),
            forward2: new Audio('/audio/Move.wav'),
            forward3: new Audio('/audio/Move.wav'),
            left45: new Audio('/audio/TurnLeft.wav'),
            left90: new Audio('/audio/TurnLeft.wav'),
            left180: new Audio('/audio/TurnLeft.wav'),
            right45: new Audio('/audio/TurnRight.wav'),
            right90: new Audio('/audio/TurnRight.wav'),
            right180: new Audio('/audio/TurnRight.wav'),
            add: new Audio('./audio/AddMovement.wav'),
            deleteAll: new Audio('/audio/DeleteAll.wav'),
            delete: new Audio('/audio/DeleteMovement.wav'),
            moveToPrevious: new Audio('/audio/MoveToLeft.wav'),
            moveToNext: new Audio('/audio/MoveToRight.wav'),
            replace: new Audio('/audio/ReplaceMovement.wav')
        };
    }

    playSound(soundName: SoundName) {
        if (this.audioEnabled) {
            this.audioLookUpTable[soundName].play();
        }
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }
};
