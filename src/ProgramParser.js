//@flow

import type { Program } from './types';

type ProgramToken = 'forward1' | 'forward2' | 'forward3' |
                    'left45' | 'left90' | 'left180' |
                    'right45' | 'right90' | 'right180' |
                    'eof';

export default class ProgramParser {
    text: string;
    textIndex: number;
    ch: string;

    constructor() {
        this.text = '';
        this.textIndex = 0;
        this.ch = 'eof';
    }

    parse(text: string): Program {
        this.text = text;
        this.textIndex = 0;
        this.nextCh();

        const program  = [];
        let token = this.getToken();
        while (token !== 'eof') {
            program.push(token);
            token = this.getToken();
        }
        return program;
    }

    getToken(): ProgramToken {
        switch(this.ch) {
            case 'eof':
                return 'eof';
            case 'f': {
                this.nextCh();
                const distance = this.getInteger();
                switch(distance) {
                    case 1:
                        return 'forward1';
                    case 2:
                        return 'forward2';
                    case 3:
                        return 'forward3';
                    default:
                        throw new Error(`Bad forward distance: ${distance}`);
                }
            }
            case 'l': {
                this.nextCh();
                const angle = this.getInteger();
                switch(angle) {
                    case 45:
                        return 'left45';
                    case 90:
                        return 'left90';
                    case 180:
                        return 'left180';
                    default:
                        throw new Error(`Bad turn left angle: ${angle}`);
                }
            }
            case 'r': {
                this.nextCh();
                const angle = this.getInteger();
                switch(angle) {
                    case 45:
                        return 'right45';
                    case 90:
                        return 'right90';
                    case 180:
                        return 'right180';
                    default:
                        throw new Error(`Bad turn right angle: ${angle}`);
                }
            }
            default:
                throw new Error(`Unexpected character: ${this.ch}`);
        }
    }

    getInteger(): number {
        let digits = '';
        while (this.isDigit()) {
            digits += this.ch;
            this.nextCh();
        }
        return parseInt(digits, 10);
    }

    nextCh() {
        if (this.textIndex >= this.text.length) {
            this.ch = 'eof';
        } else {
            this.ch = this.text.charAt(this.textIndex);
            this.textIndex += 1;
        }
    }

    isDigit(): boolean {
        return (this.ch >= '0' && this.ch <= '9');
    }
};
