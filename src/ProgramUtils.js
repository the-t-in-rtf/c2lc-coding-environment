// @flow

import type {Program} from './types';

function deleteStep(program: Program, index: number): Program {
    // Make a shallow copy before we modify it with splice()
    program = program.slice();
    program.splice(index, 1);
    return program;
};

function expandProgram(program: Program, length: number, fill: string): Program {
    // Make a shallow copy before we add to the program
    program = program.slice();
    while (program.length < length) {
        program.push(fill);
    }
    return program;
};

function overwrite(program: Program, index: number, command: string, fill: string): Program {
    program = program.slice();
    program[index] = command;
    return program;
};

function programIsEmpty(program: Program): boolean {
    for (let i=0; i<program.length; i++) {
        if (program[i] !== 'none') {
            return false;
        }
    }
    return true;
};

function swapPosition(program: Program, indexFrom: number, indexTo: number): Program {
    // Make a shallow copy before we add to the program
    program = program.slice();
    if (program[indexFrom] == null || program[indexTo] == null) {
        return program;
    }
    const currentStep = program[indexFrom];
    program[indexFrom] = program[indexTo];
    program[indexTo] = currentStep;
    return program;
}

export {
    deleteStep,
    expandProgram,
    overwrite,
    programIsEmpty,
    swapPosition
};
