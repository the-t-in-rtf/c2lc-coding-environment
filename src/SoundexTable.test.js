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
});
