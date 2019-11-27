// @flow

import * as ProgramUtils from './ProgramUtils';
import type {Program} from './types';

function checkProgramEdit(inputBefore: Program, expected: Program,
                          inputAfter: Program, result: Program) {
    expect(inputAfter).toEqual(inputBefore);
    expect(result).toEqual(expected);
};

test('deleteStep', () => {
    const testCases = [
        { input: [], index: 0, expected: [] },
        { input: [], index: 2, expected: [] },
        { input: ['foo'], index: 0, expected: [] },
        { input: ['foo'], index: 1, expected: ['foo'] },
        { input: ['foo'], index: 2, expected: ['foo'] },
        { input: ['foo', 'bar', 'baz'], index: 0, expected: ['bar', 'baz'] },
        { input: ['foo', 'bar', 'baz'], index: 1, expected: ['foo', 'baz'] }
    ];

    for (const testCase of testCases) {
        const input = testCase.input.slice();
        const result = ProgramUtils.deleteStep(input, testCase.index);
        checkProgramEdit(testCase.input, testCase.expected, input, result);
    }
});

test('expandProgram', () => {
    const testCases = [
        { input: [], length: 0, expected: [] },
        { input: [], length: 1, expected: ['fill1'] },
        { input: [], length: 2, expected: ['fill1', 'fill1'] },
        { input: ['foo'], length: 0, expected: ['foo'] },
        { input: ['foo'], length: 1, expected: ['foo'] },
        { input: ['foo'], length: 2, expected: ['foo', 'fill1'] },
        { input: ['foo'], length: 3, expected: ['foo', 'fill1', 'fill1'] }
    ];

    for (const testCase of testCases) {
        const input = testCase.input.slice();
        const result = ProgramUtils.expandProgram(input, testCase.length, 'fill1');
        checkProgramEdit(testCase.input, testCase.expected, input, result);
    }
});

test('insert', () => {
    const testCases = [
        { input: [], index: 0, expected: ['commmand1'] },
        { input: [], index: 2, expected: ['fill1', 'fill1', 'commmand1'] },
        { input: ['foo'], index: 0, expected: ['commmand1', 'foo'] },
        { input: ['foo'], index: 1, expected: ['foo', 'commmand1'] },
        { input: ['foo'], index: 2, expected: ['foo', 'fill1', 'commmand1'] },
        { input: ['foo', 'bar'], index: 1, expected: ['foo', 'commmand1', 'bar'] }
    ];

    for (const testCase of testCases) {
        const input = testCase.input.slice();
        const result = ProgramUtils.insert(input, testCase.index,
            'commmand1', 'fill1');
        checkProgramEdit(testCase.input, testCase.expected, input, result);
    }
});

test('overwrite', () => {
    const testCases = [
        { input: [], index: 0, expected: ['commmand1'] },
        { input: [], index: 2, expected: ['fill1', 'fill1', 'commmand1'] },
        { input: ['foo'], index: 0, expected: ['commmand1'] },
        { input: ['foo'], index: 1, expected: ['foo', 'commmand1'] },
        { input: ['foo'], index: 2, expected: ['foo', 'fill1', 'commmand1'] },
        { input: ['foo', 'bar', 'baz'], index: 1, expected: ['foo', 'commmand1', 'baz'] }
    ];

    for (const testCase of testCases) {
        const input = testCase.input.slice();
        const result = ProgramUtils.overwrite(input, testCase.index,
            'commmand1', 'fill1');
        checkProgramEdit(testCase.input, testCase.expected, input, result);
    }
});

test('trimEnd', () => {
    const testCases = [
        { input: [], expected: [] },
        { input: ['foo'], expected: ['foo'] },
        { input: ['trim1'], expected: [] },
        { input: ['foo', 'trim1'], expected: ['foo'] },
        { input: ['trim1', 'trim1'], expected: [] },
        { input: ['trim1', 'foo'], expected: ['trim1', 'foo'] },
        { input: ['trim1', 'foo', 'trim1'], expected: ['trim1', 'foo'] }
    ];

    for (const testCase of testCases) {
        const input = testCase.input.slice();
        const result = ProgramUtils.trimEnd(input, 'trim1');
        checkProgramEdit(testCase.input, testCase.expected, input, result);
    }
});
