// @flow

import C2lcURLParams from './C2lcURLParams';

test('Given URL query parameters, get param values', () => {
    const urlParams = new C2lcURLParams('?v=0.5&p=f1f2f3');
    expect(urlParams.getVersion()).toBe('0.5');
    expect(urlParams.getProgram()).toBe('f1f2f3');
});

test('Given URL query parameters with special characters, get decoded param values', () => {
    const urlParams = new C2lcURLParams('?v=%20%21%224&p=%28%22');
    expect(urlParams.getVersion()).toBe(' !\"4');
    expect(urlParams.getProgram()).toBe('(\"');
})
