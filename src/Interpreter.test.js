// @flow

import Interpreter from './Interpreter';
import type {CommandHandler} from './Interpreter';

function makeIncrement(varName: string): CommandHandler {
    return (interpreter) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                interpreter.memory[varName] = interpreter.memory[varName] + 1;
                resolve();
            }, 0);
        });
    };
}

test('New Interpreter has an empty program', () => {
    const interpreter = new Interpreter();
    expect(interpreter.program.length).toBe(0);
    expect(interpreter.programCounter).toBe(0);
});

test("Stepping an empty program leaves the program counter at 0", (done) => {
    const interpreter = new Interpreter();
    expect(interpreter.programCounter).toBe(0);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(0);
        done();
    });
});

test("Step a program with 1 command", (done) => {
    const interpreter = new Interpreter();
    interpreter.setCommandHandlers({
        'increment-x': makeIncrement('x')
    });
    interpreter.setProgram(['increment-x']);
    interpreter.memory.x = 10;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(1);
        expect(interpreter.memory.x).toBe(11);
        // Test step at end of program
        interpreter.step().then(() => {
            expect(interpreter.programCounter).toBe(1);
            expect(interpreter.memory.x).toBe(11);
            done();
        });
    });
});

test("Step a program with 2 commands", (done) => {
    const interpreter = new Interpreter();
    interpreter.setCommandHandlers({
        'increment-x': makeIncrement('x')
    });
    interpreter.setProgram(['increment-x', 'increment-x']);
    interpreter.memory.x = 10;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(1);
        expect(interpreter.memory.x).toBe(11);
        interpreter.step().then(() => {
            expect(interpreter.programCounter).toBe(2);
            expect(interpreter.memory.x).toBe(12);
            // Test step at end of program
            interpreter.step().then(() => {
                expect(interpreter.programCounter).toBe(2);
                expect(interpreter.memory.x).toBe(12);
                done();
            });
        });
    });
});
