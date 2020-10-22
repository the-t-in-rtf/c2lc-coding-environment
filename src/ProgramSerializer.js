// @flow

import type {Program} from './types';

export default class ProgramSerializer {
//    query: URLSearchParams;
//    onProgramChange: (program: Program) => void;

//     constructor(location: any, handleChangeProgram: (program: Program) => void) {
//         this.query = new URLSearchParams(location.search);
//         this.onProgramChange = handleChangeProgram;
//     }
    serialize(program: Program): string {
        let programURL = '';
        for (let i=0; i<program.length; i++) {
            switch(program[i]) {
                case ('forward') :
                    programURL += 'f';
                    break;
                case ('left') :
                    programURL += 'l'
                    break;
                case ('right') :
                    programURL += 'r'
                    break;
                default:
                    break;
            }
        }
        return programURL;
    }
    deserialize(programURL: string): Program {
        const decodedProgramURL = decodeURI(programURL);
        const program = [];
        for (let i=0;i<decodedProgramURL.length; i++) {
            switch(programURL.charAt(i)) {
                case ('f') :
                    program.push('forward');
                    break;
                case ('l') :
                    program.push('left');
                    break;
                case ('r') :
                    program.push('right');
                    break;
                default:
                    break;
            }
        }
        return program;
    }
};
