// @flow

import type {Program} from './types';
import ProgramParser from './ProgramParser';

export default class ProgramSerializer {
    programParser: ProgramParser;

    constructor() {
        this.programParser = new ProgramParser();
    }

    serialize(program: Program): string {
        let programText = '';
        for (let i=0; i<program.length; i++) {
            switch(program[i]) {
                case ('forward1') :
                    programText += 'f1';
                    break;
                case ('forward2') :
                    programText += 'f2';
                    break;
                case ('forward3') :
                    programText += 'f3';
                    break;
                case ('left45') :
                    programText += 'l45'
                    break;
                case ('left90') :
                    programText += 'l90'
                    break;
                case ('left180') :
                    programText += 'l180'
                    break;
                case ('right45') :
                    programText += 'r45'
                    break;
                case ('right90') :
                    programText += 'r90'
                    break;
                case ('right180') :
                    programText += 'r180'
                    break;
                default:
                    throw new Error(`Unrecognized program command when serializing program: ${program[i]}`);
            }
        }
        return programText;
    }

    deserialize(programText: string): Program {
        return this.programParser.parse(programText);
    }
};
