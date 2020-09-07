// @flow

import CharacterState from './CharacterState';
import * as C2lcMath from './C2lcMath';

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toHaveCharacterState(received, xPos, yPos, directionDegrees) {
        const pass =
            C2lcMath.approxEqual(received.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.yPos, yPos, 0.0001)
            && received.directionDegrees === directionDegrees;
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    directionDegrees: ${directionDegrees}\n`
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
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
});

const bounds = {
    minX: -200,
    minY: -300,
    maxX: 400,
    maxY: 500
};

test('Given the character is facing East, then Forward movement should move East', () => {
    (expect(new CharacterState(0, 0, 90).forward(100, bounds)): any)
        .toHaveCharacterState(100, 0, 90);
});

test('Given the character is facing South, then Forward movement should move South', () => {
    (expect(new CharacterState(0, 0, 180).forward(100, bounds)): any)
        .toHaveCharacterState(0, 100, 180);
});

test('Given the character is facing 30 degrees N of E, then Forward should move in that direction', () => {
    (expect(new CharacterState(0, 0, 60).forward(100, bounds)): any)
        .toHaveCharacterState(86.6025, -50, 60);
});

test('Movement is constrained to be within the specified bounds', () => {
    // Eastern edge
    (expect(new CharacterState(0, 0, 90).forward(1000, bounds)): any)
        .toHaveCharacterState(400, 0, 90);
    // Western edge
    (expect(new CharacterState(0, 0, 270).forward(1000, bounds)): any)
        .toHaveCharacterState(-200, 0, 270);
    // Northern edge
    (expect(new CharacterState(0, 0, 0).forward(1000, bounds)): any)
        .toHaveCharacterState(0, -300, 0);
    // Southern edge
    (expect(new CharacterState(0, 0, 180).forward(1000, bounds)): any)
        .toHaveCharacterState(0, 500, 180);
    // North Eastern corner
    (expect(new CharacterState(0, 0, 45).forward(1000, bounds)): any)
        .toHaveCharacterState(400, -300, 45);
});

test('Turn Left moves anti-clockwise and wraps at 0', () => {
    (expect(new CharacterState(0, 0, 90).turnLeft(60)): any)
        .toHaveCharacterState(0, 0, 30);
    (expect(new CharacterState(0, 0, 90).turnLeft(90)): any)
        .toHaveCharacterState(0, 0, 0);
    (expect(new CharacterState(0, 0, 90).turnLeft(120)): any)
        .toHaveCharacterState(0, 0, 330);
});

test('Turn Right moves clockwise and wraps at 360', () => {
    (expect(new CharacterState(0, 0, 270).turnRight(60)): any)
        .toHaveCharacterState(0, 0, 330);
    (expect(new CharacterState(0, 0, 270).turnRight(90)): any)
        .toHaveCharacterState(0, 0, 0);
    (expect(new CharacterState(0, 0, 270).turnRight(120)): any)
        .toHaveCharacterState(0, 0, 30);
});
