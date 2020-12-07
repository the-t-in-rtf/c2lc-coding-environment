// @flow

import type { ThemeNames } from './types';

export default class C2lcURLParams {
    urlSearchParams: URLSearchParams;

    constructor(query: string) {
        this.urlSearchParams = new URLSearchParams(query);
    }

    getVersion() {
        return this.urlSearchParams.get('v');
    }

    getProgram() {
        return this.urlSearchParams.get('p');
    }

    getCharacterState() {
        return this.urlSearchParams.get('c');
    }

    getTheme(): ThemeNames {
        switch (this.urlSearchParams.get('t')) {
            case('space'): return 'space';
            case('forest'): return 'forest';
            default: return 'default';
        }
    }
}
