// @flow

import SoundexTable from './SoundexTable';

test('Lookup on empty table', () => {
    const table = new SoundexTable([]);
    expect(table.lookupWord('')).toEqual(undefined);
    expect(table.lookupWord('foo')).toEqual(undefined);
});

test('Lookup on table with multiple entries', () => {
    const table = new SoundexTable([
        { pattern: /F6../, word: 'forward' },
        { pattern: /R.3./, word: 'right' },
        { pattern: /R3../, word: 'right' }
    ]);
    expect(table.lookupWord('')).toEqual(undefined);
    expect(table.lookupWord('forward')).toEqual('forward');
    expect(table.lookupWord('fr')).toEqual('forward');
    expect(table.lookupWord('right')).toEqual('right');
    expect(table.lookupWord('rit')).toEqual('right');
    expect(table.lookupWord('4')).toEqual('forward');
});

test('Lookup on number table', () => {
    const table = new SoundexTable([
        { pattern: /Z.../, word: 'zero'},
        { pattern: /O.../, word: 'one'},
        { pattern: /T000/, word: 'two'},
        { pattern: /T6../, word: 'three'},
        { pattern: /F6../, word: 'four'},
        { pattern: /F1../, word: 'five'},
        { pattern: /S2../, word: 'six'},
        { pattern: /S15./, word: 'seven'},
        { pattern: /E2../, word: 'eight'},
        { pattern: /N5../, word: 'nine'},
        { pattern: /T5../, word: 'ten'}
    ]);
    expect(table.lookupWord('0')).toEqual('zero');
    expect(table.lookupWord('1')).toEqual('one');
    expect(table.lookupWord('2')).toEqual('two');
    expect(table.lookupWord('3')).toEqual('three');
    expect(table.lookupWord('4')).toEqual('four');
    expect(table.lookupWord('5')).toEqual('five');
    expect(table.lookupWord('6')).toEqual('six');
    expect(table.lookupWord('7')).toEqual('seven');
    expect(table.lookupWord('8')).toEqual('eight');
    expect(table.lookupWord('9')).toEqual('nine');
    expect(table.lookupWord('10')).toEqual('ten');
});
