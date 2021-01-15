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
    expect.assertions(4);
    let programSequence = new ProgramSequence(['f1', 'f2'], 1);
    const programInput = programSequence.getProgram();
    const programInputValues = programInput.slice();
    const expectedProgramOutput = ['f2'];
    programSequence = programSequence.deleteStep(0);
    expect(programSequence.getProgram()).toStrictEqual(['f2']);
    expect(programSequence.getProgramCounter()).toBe(0);
    checkProgramEdit(programInput, expectedProgramOutput, programInputValues, programSequence.getProgram());
});

test('deleteStep should not update programCounter if deleted program step index is equal, or more than the programCounter', () => {
    expect.assertions(6);
    let programSequence = new ProgramSequence(['f1', 'f2', 'f3'], 1);
    const programInput = programSequence.getProgram();
    const programInputValues = programInput.slice();
    const expectedProgramOutput = ['f1'];
    programSequence = programSequence.deleteStep(2);
    expect(programSequence.getProgram()).toStrictEqual(['f1', 'f2']);
    expect(programSequence.getProgramCounter()).toBe(1);
    programSequence = programSequence.deleteStep(1);
    expect(programSequence.getProgram()).toStrictEqual(['f1']);
    expect(programSequence.getProgramCounter()).toBe(1);
    checkProgramEdit(programInput, expectedProgramOutput, programInputValues, programSequence.getProgram());
});

test('insertStep should increment programCounter if the step being inserted is at or before the programCounter', () => {
    expect.assertions(6);
    let programSequence = new ProgramSequence(['f1', 'f2'], 0);
    const programInput = programSequence.getProgram();
    const programInputValues = programInput.slice();
    const expectedProgramOutput = ['f1', 'f1', 'f2', 'f2'];
    programSequence = programSequence.insertStep(0, 'f1');
    expect(programSequence.getProgram()).toStrictEqual(['f1', 'f1', 'f2']);
    expect(programSequence.getProgramCounter()).toBe(1);
    programSequence = programSequence.insertStep(2, 'f2');
    expect(programSequence.getProgram()).toStrictEqual(['f1', 'f1', 'f2', 'f2']);
    expect(programSequence.getProgramCounter()).toBe(1);
    checkProgramEdit(programInput, expectedProgramOutput, programInputValues, programSequence.getProgram());
})


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

