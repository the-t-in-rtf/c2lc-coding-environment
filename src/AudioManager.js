// @flow

export default class AudioManager {
    audioEnabled: boolean;
    audioLookUpTable: Object;

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

    playSound(soundName: string) {
        if (this.audioEnabled) {
            this.audioLookUpTable[soundName].play();
        }
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }
};
