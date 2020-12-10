// @flow

import * as ProgramUtils from './ProgramUtils';
import type { Program, RunningState, CommandName } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: ?number;
    isRunning: RunningState;

    constructor() {
        this.program = [];
        this.programCounter = 0;
        this.isRunning = false;
    }

    getProgram(): Program {
        return this.program;
    }

    getProgramCounter(): number {
        return this.programCounter;
    }

    getCurrentProgramStep(): CommandName {
        return this.program[this.programCounter];
    }

    getProgramRunningState(): RunningState {
        return this.isRunning;
    }

    updateProgram(program: Program) {
        this.program = program;
    }

    updateRunningState(runningState: RunningState) {
        this.isRunning = runningState;
    }

    updateProgramCounter(value: number) {
        this.programCounter = value;
    }

    insertStep(index: number, command: string) {
        if (this.isRunning === 'paused') {
            if (index <= this.programCounter) {
                this.program = ProgramUtils.insert(this.program, index, command, 'none');
                this.programCounter ++;
            } else {
                this.program = ProgramUtils.insert(this.program, index, command, 'none');
            }
        } else if (!this.isRunning) {
            this.program = ProgramUtils.insert(this.program, index, command, 'none');
        }
    }

    deleteStep(index: number) {
        if (this.isRunning === 'paused') {
            // what happens when paused and delete everything?
            if (index <= this.programCounter && this.program.length > 1) {
                this.program = ProgramUtils.deleteStep(this.program, index)
                this.programCounter --;
            } else {
                this.program = ProgramUtils.deleteStep(this.program, index);
            }
        } else {
            this.program = ProgramUtils.deleteStep(this.program, index);
        }
    }
}
