// @flow

import { generateEncodedProgramURL } from './Utils.js';

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'f1=f2=f3')).toBe('?v=version%3D5&p=f1%3Df2%3Df3');
    expect(generateEncodedProgramURL('version?5', 'f1?f2?f3')).toBe('?v=version%3F5&p=f1%3Ff2%3Ff3');
    expect(generateEncodedProgramURL('version 5', 'f1 f2 f3')).toBe('?v=version%205&p=f1%20f2%20f3');
});
