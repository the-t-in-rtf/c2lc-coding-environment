// @flow

type CommandHandler = {
    (Interpreter): void
};

export default class Interpreter {
    commands: { [string]: CommandHandler };

    constructor(commands: { [string]: CommandHandler }) {
        this.commands = commands;
    }

    run(program: Array<string>): void {
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
