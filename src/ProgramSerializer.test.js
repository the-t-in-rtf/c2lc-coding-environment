import ProgramSerializer from './ProgramSerializer';

test('Serialize program', () => {
    const programSerializer = new ProgramSerializer();

    expect(programSerializer.serialize([])).toStrictEqual('');
    expect(programSerializer.serialize(['forward1'])).toStrictEqual('f1');
    expect(programSerializer.serialize(['left45'])).toStrictEqual('l45');
    expect(programSerializer.serialize(['right45'])).toStrictEqual('r45');
    expect(programSerializer.serialize([
        'forward2', 'left90', 'right90'
    ])).toStrictEqual('f2l90r90');
    expect(programSerializer.serialize([
        'left180', 'right180', 'forward3'
    ])).toStrictEqual('l180r180f3');
});

test('Deserialize program', () => {
    const programSerializer = new ProgramSerializer();
    expect(programSerializer.deserialize('')).toStrictEqual([]);
    expect(programSerializer.deserialize('f2f1r45')).toStrictEqual(['forward2', 'forward1', 'right45']);
})
