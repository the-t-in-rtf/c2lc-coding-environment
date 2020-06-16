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
            forward: new Audio(forwardSound),
            left: new Audio(turnLeftSound),
            right: new Audio(turnRightSound),
            addMovement: new Audio(addMovementSound),
            deleteAll: new Audio(deleteAllSound),
            deleteCurrentStep: new Audio(deleteMovementSound),
            moveToPreviousStep: new Audio(moveToLeftSound),
            moveToNextStep: new Audio(moveToRightSound),
            run: new Audio(playProgramSound),
            replaceCurrentStep: new Audio(replaceMovementSound)
        };
    }

    playSound = (soundName: string) => {
        this.audioLookUpTable[soundName].play();
    }
};
