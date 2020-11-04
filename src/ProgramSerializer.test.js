import ProgramSerializer from './ProgramSerializer';

test('Serialize program', () => {
    const programSerializer = new ProgramSerializer();

    expect(programSerializer.serialize([])).toStrictEqual('');
    expect(programSerializer.serialize(['forward1'])).toStrictEqual('f1');
    expect(programSerializer.serialize(['forward2'])).toStrictEqual('f2');
    expect(programSerializer.serialize(['forward3'])).toStrictEqual('f3');
    expect(programSerializer.serialize(['left45'])).toStrictEqual('l45');
    expect(programSerializer.serialize(['left90'])).toStrictEqual('l90');
    expect(programSerializer.serialize(['left180'])).toStrictEqual('l180');
    expect(programSerializer.serialize(['right45'])).toStrictEqual('r45');
    expect(programSerializer.serialize(['right90'])).toStrictEqual('r90');
    expect(programSerializer.serialize(['right180'])).toStrictEqual('r180');
    expect(programSerializer.serialize([
        'forward1', 'forward2', 'forward3',
        'left45', 'left90', 'left180',
        'right45', 'right90', 'right180'
    ])).toStrictEqual('f1f2f3l45l90l180r45r90r180');
});

test('Serializing an unsupported command should throw an Error', () => {
    expect(() => {
        (new ProgramSerializer()).serialize(['unsupported-command']);
    }).toThrowError(/^Unrecognized program command when serializing program: unsupported-command$/);
});

test('Deserialize program', () => {
    const programSerializer = new ProgramSerializer();
    expect(programSerializer.deserialize('')).toStrictEqual([]);
    expect(programSerializer.deserialize('f2f1r45')).toStrictEqual(['forward2', 'forward1', 'right45']);
});

test('Roundtrip program', () => {
    const programSerializer = new ProgramSerializer();
    const program = [
        'forward1', 'forward2', 'forward3',
        'left45', 'left90', 'left180',
        'right45', 'right90', 'right180'
    ];
    expect(programSerializer.deserialize(programSerializer.serialize(program))).toStrictEqual(program);
});
