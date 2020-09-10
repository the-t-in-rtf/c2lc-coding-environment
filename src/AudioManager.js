// @flow

import type {CommandName} from "./CommandPaletteCommand"

type AudioLookupTable = {
    forward: Audio,
    left: Audio,
    right: Audio,
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
            forward: new Audio('/audio/Move.wav'),
            left: new Audio('/audio/TurnLeft.wav'),
            right: new Audio('/audio/TurnRight.wav'),
            add: new Audio('./audio/AddMovement.wav'),
            deleteAll: new Audio('/audio/DeleteAll.wav'),
            delete: new Audio('/audio/DeleteMovement.wav'),
            moveToPrevious: new Audio('/audio/MoveToLeft.wav'),
            moveToNext: new Audio('/audio/MoveToRight.wav'),
            replace: new Audio('/audio/ReplaceMovement.wav')
        };
    }

    playSound(soundName: CommandName) {
        if (this.audioEnabled) {
            this.audioLookUpTable[soundName].play();
        }
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }
};
