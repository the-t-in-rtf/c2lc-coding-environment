// @flow

import soundex from 'soundex';

export type SoundexPatterns = Array<{
    pattern: Object,
    word: string
}>;

export default class SoundexTable {
    patterns: SoundexPatterns;

    constructor(patterns: SoundexPatterns) {
        this.patterns = patterns;
    }

    lookupWord(inputWord: string): ?string {
        // TODO: Generalise number pronunciation
        if (inputWord === '4') {
            inputWord = 'four';
        }
        const afterSoundex = soundex(inputWord);
        for (const entry of this.patterns) {
            if (entry.pattern.test(afterSoundex)) {
                return entry.word;
            }
        }
        return undefined;
    }
};
