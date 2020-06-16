// @flow

import forwardSound from './audio/Move.wav';
import turnLeftSound from './audio/TurnLeft.wav';
import turnRightSound from './audio/TurnRight.wav';
import addMovementSound from './audio/AddMovement.wav';
import deleteAllSound from './audio/DeleteAll.wav';
import deleteMovementSound from './audio/DeleteMovement.wav';
import moveToLeftSound from './audio/MoveToLeft.wav';
import moveToRightSound from './audio/MoveToRight.wav';
import playProgramSound from './audio/PlayProgram.wav';
import replaceMovementSound from './audio/ReplaceMovement.wav';

export default class AudioManager {
    audioLookUpTable: Object;

    constructor() {
        this.audioLookUpTable = {
            forward: forwardSound,
            left: turnLeftSound,
            right: turnRightSound,
            addMovement: addMovementSound,
            deleteAll: deleteAllSound,
            deleteCurrentStep: deleteMovementSound,
            moveToPreviousStep: moveToLeftSound,
            moveToNextStep: moveToRightSound,
            run: playProgramSound,
            replaceCurrentStep: replaceMovementSound
        };
    }

    playSound = (soundName: string) => {
        new Audio(this.audioLookUpTable[soundName]).play();
    }
};
