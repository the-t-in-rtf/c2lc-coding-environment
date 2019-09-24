// @flow

import TextSyntax from './TextSyntax';

test('Read', () => {
    const syntax = new TextSyntax();
    expect(syntax.read('')).toEqual([]);
    expect(syntax.read('foo')).toEqual(['foo']);
    expect(syntax.read('  foo  ')).toEqual(['foo']);
    expect(syntax.read(' foo  bar   baz ')).toEqual(['foo', 'bar', 'baz']);
});

test('Print', () => {
    const syntax = new TextSyntax();
    expect(syntax.print([])).toBe('');
    expect(syntax.print(['foo'])).toBe('foo');
    expect(syntax.print(['foo', 'bar', 'baz'])).toBe('foo bar baz');
});
