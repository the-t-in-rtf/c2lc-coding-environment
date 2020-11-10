// @flow

import CharacterState from './CharacterState';

export default class CharacterStateSerializer {
    characterToPositionLookUpTable: {[string]: number};
    constructor() {
        this.characterToPositionLookUpTable = {
            Z: -26,
            Y: -25,
            X: -24,
            W: -23,
            V: -22,
            U: -21,
            T: -20,
            S: -19,
            R: -18,
            Q: -17,
            P: -16,
            O: -15,
            N: -14,
            M: -13,
            L: -12,
            K: -11,
            J: -10,
            I: -9,
            H: -8,
            G: -7,
            F: -6,
            E: -5,
            D: -4,
            C: -3,
            B: -2,
            A: -1,
            '0': 0,
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7,
            h: 8,
            i: 9,
            j: 10,
            k: 11,
            l: 12,
            m: 13,
            n: 14,
            o: 15,
            p: 16,
            q: 17,
            r: 18,
            s: 19,
            t: 20,
            u: 21,
            v: 22,
            w: 23,
            x: 24,
            y: 25,
            z: 26
        };
    }

    serialize(characterState: CharacterState): string {
        let pathParam = '' +
            this.getAlphabetCoord(characterState.xPos) +
            this.getAlphabetCoord(characterState.yPos) +
            this.getDirectionCoord(characterState.direction);
        for (let i=0; i<characterState.path.length; i++) {
            const currentPath = characterState.path[i];
            const { x1, x2, y1, y2 } = currentPath;
            pathParam +=
                this.getAlphabetCoord(x1) +
                this.getAlphabetCoord(y1) +
                this.getAlphabetCoord(x2) +
                this.getAlphabetCoord(y2);
        }
        return pathParam;
    }

    deserialize(text: string): CharacterState {
        const xPos = this.characterToPositionLookUpTable[text.charAt(0)];
        const yPos = this.characterToPositionLookUpTable[text.charAt(1)];
        const direction = this.getDirectionFromCoord(text.charAt(2));
        if (xPos == null || yPos == null || direction == null ) {
            throw Error(`Invalid character position xPos=${xPos}, yPos=${yPos}, direction=${direction}`);
        }
        const path = [];
        // Split path segment part of the text every 4 characters
        const encodedPathSegments = text.substring(3).match(/.{4}/g);
        if (encodedPathSegments != null) {
            for (let i=0; i<encodedPathSegments.length; i++) {
                const x1 = this.characterToPositionLookUpTable[encodedPathSegments[i].charAt(0)];
                const y1 = this.characterToPositionLookUpTable[encodedPathSegments[i].charAt(1)];
                const x2 = this.characterToPositionLookUpTable[encodedPathSegments[i].charAt(2)];
                const y2 = this.characterToPositionLookUpTable[encodedPathSegments[i].charAt(3)];
                if (x1 != null && y1 != null && x2 != null && y2 != null) {
                    path.push({ x1, y1, x2, y2 });
                } else {
                    throw Error(`Invalid path coordinates x1=${x1} y1=${y1} x2=${x2} y2=${y2}`);
                }
            }
        }
        return new CharacterState(xPos, yPos, direction, path);
    }

    getDirectionCoord(direction: number) {
        switch(direction) {
            case(0): return '0';
            case(1): return 'a';
            case(2): return 'b';
            case(3): return 'c';
            case(4): return 'd';
            case(5): return 'e';
            case(6): return 'f';
            case(7): return 'g';
            default: return '';
        }
    }

    getDirectionFromCoord(directionCoord: string) {
        switch(directionCoord) {
            case('0'): return 0;
            case('a'): return 1;
            case('b'): return 2;
            case('c'): return 3;
            case('d'): return 4;
            case('e'): return 5;
            case('f'): return 6;
            case('g'): return 7;
            default: throw new Error(`Unrecognized direction coordinate ${directionCoord}`);
        }
    }

    getAlphabetCoord(positionComponent: number) {
        if (positionComponent === 0) {
            return '0';
        } else if (positionComponent > 0 && positionComponent < 27) {
            return String.fromCharCode(96+positionComponent);
        } else if (positionComponent > 26) {
            return 'z';
        } else if (positionComponent < 0 && positionComponent > -27) {
            return String.fromCharCode(64+Math.abs(positionComponent));
        } else if (positionComponent < -26) {
            return 'Z';
        } else  {
            return '';
        }
    }
};
