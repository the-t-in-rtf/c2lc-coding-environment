// @flow

export type Program = Array<string>;

type CommandHandler = {
    (Interpreter): void
};

export default class Interpreter {
    commands: { [string]: CommandHandler };

    constructor() {
        this.commands = {};
    }

    setCommandHandlers(commands: { [string]: CommandHandler }) {
        this.commands = commands;
    }

    run(program: Program): void {
        for (const command of program) {
            const handler = this.commands[command];
            if (handler) {
                handler(this);
            } else {
                console.log("UNKNOWN COMMAND");
            }
        }
    }
}
