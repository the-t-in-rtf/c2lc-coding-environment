// @flow

export type Program = Array<string>;

type CommandHandler = {
    (Interpreter): Promise<void>
};

export default class Interpreter {
    commands: { [string]: CommandHandler };
    program: Program;
    programCounter: number;
    isRunning: boolean;

    constructor() {
        this.commands = {};
        this.program = [];
        this.programCounter = 0;
        this.isRunning = false;
    }

    setCommandHandlers(commands: { [string]: CommandHandler }) {
        this.commands = commands;
    }

    run(program: Program): void {
        this.program = program;
        this.programCounter = 0;
        this.isRunning = true;
        this.continueRun();
    }

    continueRun(): void {
        if (this.isRunning) {
            if (this.atEnd()) {
                this.isRunning = false;
            } else {
                this.step().then(() => {
                    this.continueRun();
                });
            }
        }
    }

    atEnd(): boolean {
        return this.programCounter >= this.program.length;
    }

    step(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.atEnd()) {
                // We're at the end, nothing to do
                resolve();
            } else {
                const command = this.program[this.programCounter];
                const handler = this.commands[command];
                if (!handler) {
                    reject(new Error("Unknown command: " + command));
                } else {
                    // When the command handler has completed,
                    // increment the programCounter and resolve the step Promise
                    handler(this).then(() => {
                        this.programCounter = this.programCounter + 1;
                        resolve();
                    }, (error) => {
                        console.log(error.name);
                        console.log(error.message);
                        reject(error);
                    });
                }
            }
        });
    }
}
