// @flow

import type {Program} from './types';
import ProgramParser from './ProgramParser';

export default class ProgramSerializer {
    programParser: ProgramParser;

    constructor() {
        this.programParser = new ProgramParser();
    }

    serialize(program: Program): string {
        let programURL = '';
        for (let i=0; i<program.length; i++) {
            switch(program[i]) {
                case ('forward1') :
                    programURL += 'f1';
                    break;
                case ('forward2') :
                    programURL += 'f2';
                    break;
                case ('forward3') :
                    programURL += 'f3';
                    break;
                case ('left45') :
                    programURL += 'l45'
                    break;
                case ('left90') :
                    programURL += 'l90'
                    break;
                case ('left180') :
                    programURL += 'l180'
                    break;
                case ('right45') :
                    programURL += 'r45'
                    break;
                case ('right90') :
                    programURL += 'r90'
                    break;
                case ('right180') :
                    programURL += 'r180'
                    break;
                default:
                    break;
            }
        }
        return programURL;
    }

    deserialize(programURL: string): Program {
        const decodedProgramURL = decodeURI(programURL);
        return this.programParser.parse(decodedProgramURL);
    }
};
