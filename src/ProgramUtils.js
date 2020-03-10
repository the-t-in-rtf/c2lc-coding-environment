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

function insert(program: Program, index: number, command: string, fill: string): Program {
    program = expandProgram(program, index, fill);
    program.splice(index, 0, command);
    return program;
};

function overwrite(program: Program, index: number, command: string, fill: string): Program {
    program = expandProgram(program, index + 1, fill);
    program[index] = command;
    return program;
};

function trimEnd(program: Program, commandToTrim: string): Program {
    // Make a shallow copy before we trim
    program = program.slice();
    while ((program.length > 0)
            && (program[program.length - 1] === commandToTrim)) {
        program.pop();
    }
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

function moveUpPosition(program: Program, indexFrom: number): Program {
    let indexTo = indexFrom - 1;
    if (program[indexTo] != null) {
        let temp = program[indexTo];
        program[indexTo] = program[indexFrom];
        program[indexFrom] = temp;
    }
    return program;
};

function moveDownPosition(program: Program, indexFrom: number): Program {
    let indexTo = indexFrom + 1;
    if (program[indexTo] != null) {
        let temp = program[indexTo];
        program[indexTo] = program[indexFrom];
        program[indexFrom] = temp;
    }
    return program;
};

export {
    deleteStep,
    expandProgram,
    insert,
    overwrite,
    trimEnd,
    programIsEmpty,
    moveUpPosition,
    moveDownPosition
};
