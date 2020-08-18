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

test('Given the character is facing East, then Forward movement should move East', () => {
    (expect(new CharacterState(0, 0, 90).forward(100)): any).toHaveCharacterState(100, 0, 90);
});

test('Given the character is facing South, then Forward movement should move South', () => {
    (expect(new CharacterState(0, 0, 180).forward(100)): any).toHaveCharacterState(0, 100, 180);
});

test('Turn Left moves anti-clockwise and wraps at 0', () => {
    (expect(new CharacterState(0, 0, 90).turnLeft(60)): any).toHaveCharacterState(0, 0, 30);
    (expect(new CharacterState(0, 0, 90).turnLeft(90)): any).toHaveCharacterState(0, 0, 0);
    (expect(new CharacterState(0, 0, 90).turnLeft(120)): any).toHaveCharacterState(0, 0, 330);
});

test('Turn Right moves clockwise and wraps at 360', () => {
    (expect(new CharacterState(0, 0, 270).turnRight(60)): any).toHaveCharacterState(0, 0, 330);
    (expect(new CharacterState(0, 0, 270).turnRight(90)): any).toHaveCharacterState(0, 0, 0);
    (expect(new CharacterState(0, 0, 270).turnRight(120)): any).toHaveCharacterState(0, 0, 30);
});
