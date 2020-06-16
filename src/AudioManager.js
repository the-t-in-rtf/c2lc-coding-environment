// @flow

export default class AudioManager {
    audioLookUpTable: Object;

    constructor() {
        this.audioLookUpTable = {
            forward: new Audio('/audio/Move.wav'),
            left: new Audio('/audio/TurnLeft.wav'),
            right: new Audio('/audio/TurnRight.wav')
        };
    }

    playSound = (soundName: string) => {
        this.audioLookUpTable[soundName].play();
    }
};
