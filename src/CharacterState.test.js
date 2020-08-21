// @flow

import CharacterState from './CharacterState';
import * as C2lcMath from './C2lcMath';

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toHaveCharacterState(received, xPos, yPos, directionDegrees, path) {
        const isEqualPath = received.path[0] != null && path[0] != null ?
            C2lcMath.approxEqual(received.path[0].x2, path[0].x2, 0.0001)
            && C2lcMath.approxEqual(received.path[0].y2, path[0].y2, 0.0001) :
            received.path.length === path.length;
        const pass =
            C2lcMath.approxEqual(received.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.yPos, yPos, 0.0001)
            && received.directionDegrees === directionDegrees
            && isEqualPath;
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    directionDegrees: ${directionDegrees}\n`
                        + `    path: ${path}\n`
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
                        + `    path: ${path}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
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
