// @flow

import SoundexTable from './SoundexTable';

export default class SpeechRecognitionWrapper {
    onWord: { (string): void };
    recognition: any;
    soundexTable: SoundexTable;
    wordsSinceFinal: number;

    constructor(soundexTable: SoundexTable, onWord: { (string): void }) {
        this.soundexTable = soundexTable;
        this.onWord = onWord;

        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.lang = 'en-CA';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.onresult = this.handleSpeechRecognitionResult;

        this.wordsSinceFinal = 0;
    }

    start() {
        this.recognition.start();
    }

    stop() {
        this.recognition.stop();
    }

    handleSpeechRecognitionResult = (event: any) => {
        //this.logSpeechRecognitionEvent(event);
        let words = [];
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.length === 1) {
                Array.prototype.push.apply(words, result[0].transcript.trim().split(/\s+/));
            }
            if (result.isFinal) {
                isFinal = true;
            }
        }
        for (let i = this.wordsSinceFinal; i < words.length; ++i) {
            console.log(`Speech: ${words[i]}`);
            this.wordsSinceFinal = this.wordsSinceFinal + 1;
            const afterSoundex = this.soundexTable.lookupWord(words[i]);
            if (afterSoundex) {
                console.log(`After Soundex: ${afterSoundex}`);
                this.onWord(afterSoundex);
            } else {
                console.log(`After Soundex: undefined`);
            }
        }
        if (isFinal) {
            this.wordsSinceFinal = 0;
        }
    }

    logSpeechRecognitionEvent(event: any) {
        console.log('****');
        console.log(`resultIndex: ${event.resultIndex}`);
        console.log(`resultsLength: ${event.results.length}`);
        for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i];
            console.log(`results[${i}].length: ${result.length}`);
            console.log(`results[${i}].isFinal: ${result.isFinal}`);
            for (let j = 0; j < result.length; ++j) {
                const alternative = result[j];
                console.log(`alternative ${j}.transcript: ${alternative.transcript}`);
                console.log(`alternative ${j}.confidence: ${alternative.confidence}`);
            }
        }
    }
};
