// @flow

import ProgramSequence from './ProgramSequence';

function checkProgramEdit(inputBefore: Program, expected: Program,
                          inputAfter: Program, result: Program) {
    expect(inputAfter).toEqual(inputBefore);
    expect(result).toEqual(expected);
};

test('ProgramSequence constructor should take program, programCounter, and isRunning parameters', () => {
    const program = ['f1'];
    const programCounter = 0;
    const isRunning = 'stopped';
    const programSequence = new ProgramSequence(program, programCounter, isRunning);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
    expect(programSequence.getProgramRunningState()).toBe(isRunning);
});

test.each([
    [[], 0, ['command1']],
    [[], 2, ['command1']],
    [['foo'], 0, ['command1', 'foo']],
    [['foo'], 1, ['foo', 'command1']],
    [['foo'], 2, ['foo', 'command1']],
    [['foo', 'bar'], 1, ['foo', 'command1', 'bar']]
])('insert',
    (input: Array<string>, index: number, expected: Array<string>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = new ProgramSequence(input, 0, 'stopped').insert(index, 'command1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, []],
    [[], 2, []],
    [['foo'], 0, []],
    [['foo'], 1, ['foo']],
    [['foo'], 2, ['foo']],
    [['foo', 'bar', 'baz'], 0, ['bar', 'baz']],
    [['foo', 'bar', 'baz'], 1, ['foo', 'baz']]
])('delete',
    (input: Array<string>, index: number, expected: Array<string>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = new ProgramSequence(input, 0, 'stopped').delete(index);
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, ['command1']],
    [['foo'], 0, ['command1']],
    [['foo', 'bar'], 1, ['foo', 'command1']],
    [['foo', 'bar', 'baz'], 1, ['foo', 'command1', 'baz']]
])('overwrite',
    (input: Array<string>, index: number, expected: Array<string>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = new ProgramSequence(input, 0, 'stopped').overwrite(index, 'command1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test('insertStep method should append a command at the end of the program property', () => {
    const programSequence = new ProgramSequence([], 0, 'stopped');
    expect(programSequence.insertStep())
})

