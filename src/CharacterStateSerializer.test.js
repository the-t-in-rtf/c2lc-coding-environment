// @flow

import CharacterStateSerializer from './CharacterStateSerializer';
import CharacterState from './CharacterState';

test('Serialize character state', () => {
    expect.assertions(5);
    const characterStateSerializer = new CharacterStateSerializer();
    let characterState = new CharacterState(0, 0, 2, []);
    expect(characterStateSerializer.serialize(characterState)).toBe('00b');
    characterState = new CharacterState(1, 1, 4, [{x1: 0, y1: 0, x2: 1, y2: 1}]);
    expect(characterStateSerializer.serialize(characterState)).toBe('aad00aa');
    characterState = new CharacterState(-1, -1, 7, [{x1: 0, y1: 0, x2: -1, y2: -1}]);
    expect(characterStateSerializer.serialize(characterState)).toBe('AAg00AA');
    characterState = new CharacterState(-29, -29, 0, []);
    expect(characterStateSerializer.serialize(characterState)).toBe('ZZ0');
    characterState = new CharacterState(29, 1000, 3, []);
    expect(characterStateSerializer.serialize(characterState)).toBe('zzc');
});

test('Deserialize character state', () => {
    expect.assertions(5);
    const characterStateSerializer = new CharacterStateSerializer();
    let text = '00b';
    expect(characterStateSerializer.deserialize(text)).toStrictEqual(new CharacterState(0,0,2,[]));
    text = 'aab00aa';
    expect(characterStateSerializer.deserialize(text)).toStrictEqual(new CharacterState(1,1,2,[{x1:0,y1:0,x2:1,y2:1}]));
    text = 'AAc00AA';
    expect(characterStateSerializer.deserialize(text)).toStrictEqual(new CharacterState(-1,-1,3,[{x1:0,y1:0,x2:-1,y2:-1}]));
    text = '3ac00AA';
    expect(() => {
        characterStateSerializer.deserialize(text)
    }).toThrowError(/^Invalid character position xPos=undefined, yPos=1, direction=3$/);
    text = 'aab3322';
    expect(() => {
        characterStateSerializer.deserialize(text)
    }).toThrowError(/^Invalid path coordinates x1=undefined y1=undefined x2=undefined y2=undefined$/);
});

test('getDirectionCoord', () => {
    expect.assertions(8);
    const characterStateSerializer = new CharacterStateSerializer();
    expect(characterStateSerializer.getDirectionCoord(0)).toBe('0');
    expect(characterStateSerializer.getDirectionCoord(1)).toBe('a');
    expect(characterStateSerializer.getDirectionCoord(2)).toBe('b');
    expect(characterStateSerializer.getDirectionCoord(3)).toBe('c');
    expect(characterStateSerializer.getDirectionCoord(4)).toBe('d');
    expect(characterStateSerializer.getDirectionCoord(5)).toBe('e');
    expect(characterStateSerializer.getDirectionCoord(6)).toBe('f');
    expect(characterStateSerializer.getDirectionCoord(7)).toBe('g');
});

test('getDirectionFromCoord', () => {
    expect.assertions(9);
    const characterStateSerializer = new CharacterStateSerializer();
    expect(characterStateSerializer.getDirectionFromCoord('0')).toBe(0);
    expect(characterStateSerializer.getDirectionFromCoord('a')).toBe(1);
    expect(characterStateSerializer.getDirectionFromCoord('b')).toBe(2);
    expect(characterStateSerializer.getDirectionFromCoord('c')).toBe(3);
    expect(characterStateSerializer.getDirectionFromCoord('d')).toBe(4);
    expect(characterStateSerializer.getDirectionFromCoord('e')).toBe(5);
    expect(characterStateSerializer.getDirectionFromCoord('f')).toBe(6);
    expect(characterStateSerializer.getDirectionFromCoord('g')).toBe(7);
    expect(() => {
        characterStateSerializer.getDirectionFromCoord('3')
    }).toThrowError(/^Unrecognized direction coordinate 3$/);
});

test('getAlphabetCoord', () => {
    expect.assertions(7);
    const characterStateSerializer = new CharacterStateSerializer();
    expect(characterStateSerializer.getAlphabetCoord(0)).toBe('0');
    expect(characterStateSerializer.getAlphabetCoord(-1)).toBe('A');
    expect(characterStateSerializer.getAlphabetCoord(1)).toBe('a');
    expect(characterStateSerializer.getAlphabetCoord(-26)).toBe('Z');
    expect(characterStateSerializer.getAlphabetCoord(26)).toBe('z');
    expect(characterStateSerializer.getAlphabetCoord(-130)).toBe('Z');
    expect(characterStateSerializer.getAlphabetCoord(34)).toBe('z');
})
