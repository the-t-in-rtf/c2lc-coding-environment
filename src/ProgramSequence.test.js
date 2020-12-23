// @flow

import ProgramSequence from './ProgramSequence';
import type { Program } from './types';

function checkProgramEdit(
    inputBefore: Program, expected: Program,
    inputAfter: Program, result: Program)
{
    expect(inputAfter).toEqual(inputBefore);
    expect(result).toEqual(expected);
};

test('ProgramSequence constructor should take program and programCounter parameters', () => {
    expect.assertions(2);
    const program = ['f1'];
    const programCounter = 0;
    const programSequence = new ProgramSequence(program, programCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
});

test('updateProgramCounter should only update programCounter', () => {
    expect.assertions(2);
    const program = ['f1'];
    let programSequence = new ProgramSequence(program, 0);
    const newProgramCounter = 1;
    programSequence = programSequence.updateProgramCounter(newProgramCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(newProgramCounter);
});

test('incrementProgramCounter should increment programCounter by 1', () => {
    expect.assertions(1);
    let programSequence = new ProgramSequence([], 0);
    programSequence = programSequence.incrementProgramCounter();
    expect(programSequence.getProgramCounter()).toBe(1);
});

test('deleteStep updates programCounter if deleted program step index is less than the programCounter', () => {
    expect.assertions(2);
    let programSequence = new ProgramSequence(['f1', 'f2'], 1);
    programSequence = programSequence.deleteStep(0);
    expect(programSequence.getProgram()).toStrictEqual(['f2']);
    expect(programSequence.getProgramCounter()).toBe(0);
});

test('deleteStep should not update programCounter if deleted program step index is equal, or more than the programCounter', () => {
    expect.assertions(4);
    let programSequence = new ProgramSequence(['f1', 'f2', 'f3'], 1);
    programSequence = programSequence.deleteStep(2);
    expect(programSequence.getProgram()).toStrictEqual(['f1', 'f2']);
    expect(programSequence.getProgramCounter()).toBe(1);
    programSequence = programSequence.deleteStep(1);
    expect(programSequence.getProgram()).toStrictEqual(['f1']);
    expect(programSequence.getProgramCounter()).toBe(1);
});

test('insertStep should increment programCounter', () => {
    expect.assertions(2);
    let programSequence = new ProgramSequence([], 0);
    programSequence = programSequence.insertStep(0, 'f1');
    expect(programSequence.getProgram()).toStrictEqual(['f1']);
    expect(programSequence.getProgramCounter()).toBe(1);
})

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
        const result = new ProgramSequence(input, 0).insert(index, 'command1');
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
        const result = new ProgramSequence(input, 0).delete(index);
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
        const result = new ProgramSequence(input, 0).overwrite(index, 'command1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, 2, []],
    [['command1'], 0, 1, ['command1']],
    [['command1', 'command2', 'command3'], 1, 2, ['command1', 'command3', 'command2' ]],
    [['command1', 'command2', 'command3'], 0, 2, ['command3', 'command2', 'command1']]

]) ('swapPosition',
    (input: Array<string>, indexFrom: number, indexTo: number,  expected: Array<string>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = new ProgramSequence(input, 0).swapPosition(indexFrom, indexTo);
        checkProgramEdit(input, expected, inputValues, result);
    }
);

