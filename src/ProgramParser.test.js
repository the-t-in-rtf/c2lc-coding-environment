//@flow

import ProgramParser from './ProgramParser';

test('Parse empty string', () => {
    expect((new ProgramParser()).parse('')).toStrictEqual([]);
});

test('Parse unsupported character', () => {
    expect(() => {
        (new ProgramParser()).parse('a');
    }).toThrowError(/^Unexpected character: a$/);
});

test('Parse bad forward distance', () => {
    expect(() => {
        (new ProgramParser()).parse('f');
    }).toThrowError(/^Bad forward distance: NaN$/);

    expect(() => {
        (new ProgramParser()).parse('f100');
    }).toThrowError(/^Bad forward distance: 100$/);
});

test('Parse bad turn left angle', () => {
    expect(() => {
        (new ProgramParser()).parse('l');
    }).toThrowError(/^Bad turn left angle: NaN$/);

    expect(() => {
        (new ProgramParser()).parse('l100');
    }).toThrowError(/^Bad turn left angle: 100$/);
});

test('Parse bad turn right angle', () => {
    expect(() => {
        (new ProgramParser()).parse('r');
    }).toThrowError(/^Bad turn right angle: NaN$/);

    expect(() => {
        (new ProgramParser()).parse('r100');
    }).toThrowError(/^Bad turn right angle: 100$/);
});

test('Parse f1', () => {
    expect((new ProgramParser()).parse('f1')).toStrictEqual(['forward1']);
});

test('Parse f2', () => {
    expect((new ProgramParser()).parse('f2')).toStrictEqual(['forward2']);
});

test('Parse f3', () => {
    expect((new ProgramParser()).parse('f3')).toStrictEqual(['forward3']);
});

test('Parse l45', () => {
    expect((new ProgramParser()).parse('l45')).toStrictEqual(['left45']);
});

test('Parse l90', () => {
    expect((new ProgramParser()).parse('l90')).toStrictEqual(['left90']);
});

test('Parse l180', () => {
    expect((new ProgramParser()).parse('l180')).toStrictEqual(['left180']);
});

test('Parse r45', () => {
    expect((new ProgramParser()).parse('r45')).toStrictEqual(['right45']);
});

test('Parse r90', () => {
    expect((new ProgramParser()).parse('r90')).toStrictEqual(['right90']);
});

test('Parse r180', () => {
    expect((new ProgramParser()).parse('r180')).toStrictEqual(['right180']);
});

test('Parse program with multiple commands', () => {
    expect((new ProgramParser()).parse('f1f2f3l45l90l180r45r90r180')).toStrictEqual([
        'forward1',
        'forward2',
        'forward3',
        'left45',
        'left90',
        'left180',
        'right45',
        'right90',
        'right180'
    ]);
});
