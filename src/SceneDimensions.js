// @flow

type BoundsType = 'inBounds' | 'outOfBoundsAbove' | 'outOfBoundsBelow';

export default class SceneDimensions {
    #width: number;
    #height: number;
    #minX: number;
    #minY: number;
    #maxX: number;
    #maxY: number;

    constructor(width: number, height: number) {
        this.#width = width;
        this.#height = height;
        this.#minX = 0;
        this.#minY = 0;
        this.#maxX = width;
        this.#maxY = height;
    }

    getWidth(): number {
        return this.#width;
    }

    getHeight(): number {
        return this.#height;
    }

    getMinX(): number {
        return this.#minX;
    }

    getMinY(): number {
        return this.#minY;
    }

    getMaxX(): number {
        return this.#maxX;
    }

    getMaxY(): number {
        return this.#maxY;
    }

    getBoundsStateX(x: number): BoundsType {
        if (x < this.#minX) {
            return 'outOfBoundsBelow';
        } else if (x > this.#maxX) {
            return 'outOfBoundsAbove';
        }
        return 'inBounds';
    }

    getBoundsStateY(y: number): BoundsType {
        if (y < this.#minY) {
            return 'outOfBoundsBelow';
        } else if (y > this.#maxY) {
            return 'outOfBoundsAbove';
        }
        return 'inBounds';
    }
};
