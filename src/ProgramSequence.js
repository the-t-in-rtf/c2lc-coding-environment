// @flow

import type { Program } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: number;

    constructor(program: Program, programCounter: number) {
        this.program = program;
        this.programCounter = programCounter;
    }

    getProgram(): Program {
        return this.program;
    }

    getProgramLength(): number {
        return this.program.length;
    }

    getProgramCounter(): number {
        return this.programCounter;
    }

    getCurrentProgramStep(): string {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): string {
        return this.program[index];
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(program, this.programCounter);
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(program, programCounter);
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1);
    }

    overwriteStep(index: number, command: string): ProgramSequence {
        return this.updateProgram(this.overwrite(index, command));
    }

    insertStep(index: number, command: string): ProgramSequence {
        if (index <= this.programCounter) {
            return this.updateProgramAndProgramCounter(this.insert(index, command), this.programCounter + 1);
        } else {
            return this.updateProgram(this.insert(index, command));
        }
    }

    deleteStep(index: number): ProgramSequence {
        if (index < this.programCounter && this.program.length > 1) {
            return this.updateProgramAndProgramCounter(this.delete(index), this.programCounter - 1);
        } else {
            return this.updateProgram(this.delete(index));
        }
    }

    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        return this.updateProgram(this.swapPosition(indexFrom, indexTo));
    }

    swapPosition(indexFrom: number, indexTo: number): Program {
        // Make a shallow copy before we add to the program
        const program = this.program.slice();
        if (program[indexFrom] == null || program[indexTo] == null) {
            return program;
        }
        const currentStep = program[indexFrom];
        program[indexFrom] = program[indexTo];
        program[indexTo] = currentStep;
        return program;
    }

    insert(index: number, command: string): Program {
        const program = this.program.slice();
        program.splice(index, 0, command);
        return program;
    };

    overwrite(index: number, command: string): Program {
        const program = this.program.slice();
        program[index] = command;
        return program;
    };

    delete(index: number): Program {
        const program = this.program.slice();
        program.splice(index, 1);
        return program;
    };
}
