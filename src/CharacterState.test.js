// @flow

import CharacterState from './CharacterState';
import * as C2lcMath from './C2lcMath';

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toHaveCharacterState(received, xPos, yPos, directionDegrees, path) {
        const pass =
            C2lcMath.approxEqual(received.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.yPos, yPos, 0.0001)
            && received.directionDegrees === directionDegrees
            && received.pathEquals(path, 0.0001);
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    directionDegrees: ${directionDegrees}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: true
            };
        } else {
            return {
                message: () => {
                    return 'Expected:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    directionDegrees: ${directionDegrees}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
});

test('CharacterState.pathEquals', () => {
    const oneSegment = [{x1: 100, y1: 200, x2: 300, y2: 400}];
    const twoSegments = [
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ];

    expect(new CharacterState(0, 0, 0, []).pathEquals([], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, []).pathEquals(oneSegment, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, []).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals(oneSegment, 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, oneSegment).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400}
        ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 600, x2: 700, y2: 800}
        ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 501, y1: 600, x2: 700, y2: 800}
        ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 601, x2: 700, y2: 800}
        ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 600, x2: 701, y2: 800}
        ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 600, x2: 700, y2: 801}
        ], 1)).toBeFalsy();
});

test('Given the character is facing East, then Forward movement should move East', () => {
    (expect(new CharacterState(0, 0, 90, []).forward(100)): any).toHaveCharacterState(100, 0, 90, [{x1: 0, y1: 0, x2: 100, y2: 0}]);
});

test('Given the character is facing South, then Forward movement should move South', () => {
    (expect(new CharacterState(0, 0, 180, []).forward(100)): any).toHaveCharacterState(0, 100, 180, [{x1: 0, y1: 0, x2: 0, y2: 100 }]);
});

test('Given the character is facing 30 degrees N of E, then Forward should move in that direction', () => {
    (expect(new CharacterState(0, 0, 60, []).forward(100)): any).toHaveCharacterState(86.6025, -50, 60, [{x1: 0, y1: 0, x2: 86.6025, y2: -50}]);
});

test('Turn Left moves anti-clockwise and wraps at 0', () => {
    (expect(new CharacterState(0, 0, 90, []).turnLeft(60)): any).toHaveCharacterState(0, 0, 30, []);
    (expect(new CharacterState(0, 0, 90, []).turnLeft(90)): any).toHaveCharacterState(0, 0, 0, []);
    (expect(new CharacterState(0, 0, 90, []).turnLeft(120)): any).toHaveCharacterState(0, 0, 330, []);
});

test('Turn Right moves clockwise and wraps at 360', () => {
    (expect(new CharacterState(0, 0, 270, []).turnRight(60)): any).toHaveCharacterState(0, 0, 330, []);
    (expect(new CharacterState(0, 0, 270, []).turnRight(90)): any).toHaveCharacterState(0, 0, 0, []);
    (expect(new CharacterState(0, 0, 270, []).turnRight(120)): any).toHaveCharacterState(0, 0, 30, []);
});

test('Each Forward move should create a path segment', () => {
    (expect(new CharacterState(0, 0, 90, []).forward(100).forward(100)): any).toHaveCharacterState(200, 0, 90, [{x1: 0, y1: 0, x2: 100, y2: 0}, {x1: 100, y1: 0, x2: 200, y2: 0}]);
    (expect(new CharacterState(0, 0, 90, []).forward(100).turnLeft(90).forward(100)): any).toHaveCharacterState(100, -100, 0, [{x1: 0, y1: 0, x2: 100, y2: 0}, {x1: 100, y1: 0, x2: 100, y2: -100}]);
    (expect(new CharacterState(0, 0, 90, []).forward(100).turnRight(90).forward(100)): any).toHaveCharacterState(100, 100, 180, [{x1: 0, y1: 0, x2: 100, y2: 0}, {x1: 100, y1: 0, x2: 100, y2: 100}]);
});
