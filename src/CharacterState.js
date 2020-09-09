// @flow

import * as C2lcMath from './C2lcMath';

type PathSegment = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
};

export default class CharacterState {
    xPos: number; // Positive x is East
    yPos: number; // Positive y is South
    directionDegrees: number; // 0 is North, 90 is East
    path: Array<PathSegment>;

    constructor(xPos: number, yPos: number, directionDegrees: number, path: Array<PathSegment>) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.directionDegrees = directionDegrees;
        this.path = path;
    }

    pathEquals(otherPath: Array<PathSegment>, epsilon: number) {
        if (this.path.length !== otherPath.length) {
            return false;
        }
        for (let i = 0; i < this.path.length; i++) {
            if (!C2lcMath.approxEqual(this.path[i].x1, otherPath[i].x1, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].y1, otherPath[i].y1, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].x2, otherPath[i].x2, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].y2, otherPath[i].y2, epsilon)) {
                return false;
            }
        }
        return true;
    }

    forward(distance: number, drawingEnabled: boolean): CharacterState {
        const directionRadians = C2lcMath.degrees2radians(this.directionDegrees);
        const xOffset = Math.sin(directionRadians) * distance;
        const yOffset = Math.cos(directionRadians) * distance;
        const newPathSegment = {
            x1: this.xPos,
            y1: this.yPos,
            x2: this.xPos + xOffset,
            y2: this.yPos - yOffset
        };
        return new CharacterState(
            this.xPos + xOffset,
            this.yPos - yOffset,
            this.directionDegrees,
            drawingEnabled ?
                this.path.concat([newPathSegment]) :
                this.path
        );
    }

    turnLeft(amountDegrees: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 360, this.directionDegrees - amountDegrees),
            this.path
        );
    }

    turnRight(amountDegrees: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 360, this.directionDegrees + amountDegrees),
            this.path
        );
    }
}
