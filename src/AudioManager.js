// @flow

export default class AudioManager {
    audioLookUpTable: Object;

    constructor() {
        this.audioLookUpTable = {
            forward: '/audio/Move.wav',
            left: '/audio/TurnLeft.wav',
            right: '/audio/TurnRight.wav',
            add: './audio/AddMovement.wav',
            deleteAll: '/audio/DeleteAll.wav',
            delete: '/audio/DeleteMovement.wav',
            moveToPrevious: '/audio/MoveToLeft.wav',
            moveToNext: '/audio/MoveToRight.wav',
            replace: '/audio/ReplaceMovement.wav'
        };
    }

    playSound = (soundName: string) => {
        new Audio(this.audioLookUpTable[soundName]).play();
    }
};
