// @flow

export default class AudioManager {
    audioLookUpTable: Object;

    constructor() {
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

    playSound = (soundName: string) => {
        this.audioLookUpTable[soundName].play();
    }
};
