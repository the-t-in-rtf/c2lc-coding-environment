// @flow

import type {Program} from './Interpreter';

export default class TextSyntax {
    read(text: string): Program {
        if (text.trim().length === 0) {
            return [];
        }
        return text.trim().split(/\s+/);
    }

    print(program: Program): string {
        return program.join(" ");
    }
}
