// @flow

import type { RunningState } from './types';
import ProgramSequence from './ProgramSequence';

/* eslint-disable no-use-before-define */
export type CommandHandler = { (Interpreter, stepTimeMs: number): Promise<void> };
/* eslint-enable no-use-before-define */

export default class Interpreter {
    commands: { [command: string]: { [namespace: string]: CommandHandler } };
    stepTimeMs: number;
    programSequence: ProgramSequence;
    runningState: RunningState;
    requestIncrementProgramCounter: () => void;
    requestSetRunningState: (runningState: RunningState) => void;

    constructor(stepTimeMs: number, programSequence: ProgramSequence, requestIncrementProgramCounter: () => void, requestSetRunningState: (runningState: RunningState) => void) {
        this.commands = {};
        this.stepTimeMs = stepTimeMs;
        this.programSequence = programSequence;
        this.runningState = 'stopped';
        this.requestIncrementProgramCounter = requestIncrementProgramCounter;
        this.requestSetRunningState = requestSetRunningState;
    }

    addCommandHandler(command: string, namespace: string, handler: CommandHandler) {
        let commandNamespaces = this.commands[command];
        if (!commandNamespaces) {
            commandNamespaces = {};
            this.commands[command] = commandNamespaces;
        }
        commandNamespaces[namespace] = handler;
    }

    setProgramSequence(programSequence: ProgramSequence) {
        this.programSequence = programSequence;
    }

    setRunningState(runningState: RunningState) {
        this.runningState = runningState;
    }

    setStepTime(stepTimeMs: number) {
        this.stepTimeMs = stepTimeMs;
    }

    run(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.continueRun(resolve, reject);
        });
    }

    continueRun(resolve: (result:any) => void, reject: (error: any) => void): void {
        if (this.runningState === 'running') {
            if (this.atEnd()) {
                this.requestSetRunningState('stopped');
                resolve();
            } else {
                //this.onRunningStateChange({isRunning: this.isRunning, activeStep: this.programCounter});
                this.step().then(() => {
                    this.continueRun(resolve, reject);
                }, (error: Error) => {
                    // Reject the run Promise when the step Promise is rejected
                    this.requestSetRunningState('stopped');
                    reject(error);
                });
            }
        } else {
            resolve();
        }
    }

    atEnd(): boolean {
        return this.programSequence.getProgramCounter() >= this.programSequence.getProgramLength();
    }

    step(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.atEnd()) {
                // We're at the end, nothing to do
                resolve();
            } else {
                this.doCommand(this.programSequence.getCurrentProgramStep()).then(() => {
                    // When the command has completed, increment
                    // the programCounter and resolve the step Promise
                    this.requestIncrementProgramCounter();
                    resolve();
                }, (error: Error) => {
                    reject(error);
                });
            }
        });
    }

    doCommand(command: string): Promise<any> {
        const handlers = this.lookUpCommandHandlers(command);
        if (handlers.length === 0) {
            return Promise.reject(new Error(`Unknown command: ${command}`));
        } else {
            return this.callCommandHandlers(handlers);
        }
    }

    callCommandHandlers(handlers: Array<CommandHandler>): Promise<any> {
        const promises = [];
        const stepTimeMs = this.stepTimeMs;
        for (const handler of handlers) {
            promises.push(handler(this, stepTimeMs));
        }
        return Promise.all(promises);
    };

    lookUpCommandHandlers(command: string): Array<CommandHandler> {
        const commandNamespaces = this.commands[command];
        if (commandNamespaces) {
            const handlers = [];
            for (const namespace in commandNamespaces) {
                handlers.push(commandNamespaces[namespace]);
            }
            return handlers;
        } else {
            return [];
        }
    }
}
