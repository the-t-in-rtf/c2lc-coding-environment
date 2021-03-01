// @flow

import { generateEncodedProgramURL, getThemeFromString } from './Utils.js';

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'light', 'f1=f2=f3', '0ab')).toBe('?v=version%3D5&t=light&p=f1%3Df2%3Df3&c=0ab');
    expect(generateEncodedProgramURL('version?5', 'dark', 'f1?f2?f3', '0aab0c0')).toBe('?v=version%3F5&t=dark&p=f1%3Ff2%3Ff3&c=0aab0c0');
    expect(generateEncodedProgramURL('version 5', 'mono', 'f1 f2 f3', '0a b c')).toBe('?v=version%205&t=mono&p=f1%20f2%20f3&c=0a%20b%20c');
});

test('Test getThemeFromString', () => {
    expect(getThemeFromString('', 'light')).toBe('light');
    expect(getThemeFromString(null, 'light')).toBe('light');
    expect(getThemeFromString('light', 'light')).toBe('light');
    expect(getThemeFromString('dark', 'light')).toBe('dark');
    expect(getThemeFromString('high', 'light')).toBe('high');
    expect(getThemeFromString('mono', 'light')).toBe('mono');
})
