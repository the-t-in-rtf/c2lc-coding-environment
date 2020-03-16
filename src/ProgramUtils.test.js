// @flow

import * as ProgramUtils from './ProgramUtils';
import type {Program} from './types';

function checkProgramEdit(inputBefore: Program, expected: Program,
                          inputAfter: Program, result: Program) {
    expect(inputAfter).toEqual(inputBefore);
    expect(result).toEqual(expected);
};

test.each([
    [[], 0, []],
    [[], 2, []],
    [['foo'], 0, []],
    [['foo'], 1, ['foo']],
    [['foo'], 2, ['foo']],
    [['foo', 'bar', 'baz'], 0, ['bar', 'baz']],
    [['foo', 'bar', 'baz'], 1, ['foo', 'baz']]
])('deleteStep',
    (input, index, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.deleteStep(inputValues, index);
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, []],
    [[], 1, ['fill1']],
    [[], 2, ['fill1', 'fill1']],
    [['foo'], 0, ['foo']],
    [['foo'], 1, ['foo']],
    [['foo'], 2, ['foo', 'fill1']],
    [['foo'], 3, ['foo', 'fill1', 'fill1']]
])('expandProgram',
    (input, length, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.expandProgram(inputValues, length, 'fill1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, ['command1']],
    [[], 2, ['fill1', 'fill1', 'command1']],
    [['foo'], 0, ['command1', 'foo']],
    [['foo'], 1, ['foo', 'command1']],
    [['foo'], 2, ['foo', 'fill1', 'command1']],
    [['foo', 'bar'], 1, ['foo', 'command1', 'bar']]
])('insert',
    (input, index, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.insert(inputValues, index, 'command1', 'fill1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, ['command1']],
    [[], 2, ['fill1', 'fill1', 'command1']],
    [['foo'], 0, ['command1']],
    [['foo'], 1, ['foo', 'command1']],
    [['foo'], 2, ['foo', 'fill1', 'command1']],
    [['foo', 'bar', 'baz'], 1, ['foo', 'command1', 'baz']]
])('overwrite',
    (input, index, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.overwrite(inputValues, index, 'command1', 'fill1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], []],
    [['foo'], ['foo']],
    [['trim1'], []],
    [['foo', 'trim1'], ['foo']],
    [['trim1', 'trim1'], []],
    [['trim1', 'foo'], ['trim1', 'foo']],
    [['trim1', 'foo', 'trim1'], ['trim1', 'foo']]
])('trimEnd',
    (input, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.trimEnd(inputValues, 'trim1');
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], true],
    [['none', 'none'], true],
    [['command1', 'none'], false],
    [['none', 'none', 'command1'], false],
    [['command1', 'none', 'command1'], false]
])('programIsEmpty',
    (input, expected) => {
        expect.assertions(1);
        const result = ProgramUtils.programIsEmpty(input);
        expect(result).toBe(expected);
    }
);

test.each([
    [[], 0, []],
    [[], 2, []],
    [['command1'], 0, ['command1']],
    [['command1', 'command2', 'command3'], 1, ['command2', 'command1', 'command3']]
])('moveUpPosition',
    (input, indexFrom, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.moveUpPosition(inputValues, indexFrom);
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, []],
    [[], 2, []],
    [['command1'], 0, ['command1']],
    [['command1', 'command2', 'command3'], 1, ['command1', 'command3', 'command2']]
])('moveDownPosition',
    (input, indexFrom, expected) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.moveDownPosition(inputValues, indexFrom);
        checkProgramEdit(input, expected, inputValues, result);
    }
);
