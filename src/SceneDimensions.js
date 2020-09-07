// @flow

import type { SceneBounds } from './types';

export default class SceneDimensions {
    #numRows: number;
    #numColumns: number;
    #gridCellWidth: number;
    #width: number;
    #height: number;
    #minX: number;
    #minY: number;
    #bounds: SceneBounds;

    constructor(numRows: number, numColumns: number, gridCellWidth: number) {
        this.#numRows = numRows;
        this.#numColumns = numColumns;
        this.#gridCellWidth = gridCellWidth;
        this.#width = numColumns * gridCellWidth;
        this.#height = numRows * gridCellWidth;
        this.#minX = this.#width * -0.5;
        this.#minY = this.#height * -0.5;
        this.#bounds = {
            minX: this.#minX,
            minY: this.#minY,
            maxX: this.#width * 0.5,
            maxY: this.#height * 0.5
        }
    }

    getNumRows(): number {
        return this.#numRows;
    }

    getNumColumns(): number {
        return this.#numColumns;
    }

    getGridCellWidth(): number {
        return this.#gridCellWidth;
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

    getBounds(): SceneBounds {
        return this.#bounds;
    }
};
