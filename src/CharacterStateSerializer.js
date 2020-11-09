// @flow

import CharacterState from './CharacterState';

export default class CharacterStateSerializer {

    constructor(numColumns: number,  numRows: number) {
        this.characterToPositionLookUpTable = this.generateCharacterToPositionLookUpTable();
        console.log(this.characterToPositionLookUpTable);
    }

    generateCharacterToPositionLookUpTable() {
        const charToPosition = {};
        for (let i=-26; i<27; i++) {
            if (i < 0) {
                console.log(116 + i);
                charToPosition[String.fromCharCode(116 + i)] = i;
            } else if (i === 0) {
                charToPosition['0'] = 0;
            } else {
                charToPosition[String.fromCharCode(96 + i)] = i;
            }
        }
        return charToPosition;
    }

    serialize(characterState: CharacterState): string {
        let pathParam = '';
        for (let i=0; i<characterState.path.length; i++) {
            const currentPath = characterState.path[i];
            const { x1, x2, y1, y2 } = currentPath;
            pathParam +=
                this.getAlphabetCoord(x1) +
                this.getAlphabetCoord(y1) +
                this.getDirectionCoord(x1, y1, x2, y2);
        }
        return pathParam;
    }

    deserialize(text: string): CharacterState {
        return text;
    }

    getDirectionCoord(x1: number, y1: number, x2: number, y2: number) {
        if (x1 === x2 && y1 > y2) {
            return '0';
        } else if (x1 < x2 && y1 > y2) {
            return 'a';
        } else if (x1 < x2 && y1 === y2) {
            return 'b';
        } else if (x1 < x2 && y1 < y2) {
            return 'c';
        } else if (x1 === x2 && y1 < y2) {
            return 'd';
        } else if (x1 > x2 && y1 < y2) {
            return 'e';
        } else if (x1 > x2 && y1 === y2) {
            return 'f';
        } else if (x1 > x2 && y1 > y2) {
            return 'g';
        }
    }

    getAlphabetCoord(positionComponent: number) {
        if (positionComponent === 0) {
            return '0';
        } else if (positionComponent > 0) {
            return String.fromCharCode(96+positionComponent);
        } else {
            return String.fromCharCode(64+Math.abs(positionComponent));
        }
    }
};
