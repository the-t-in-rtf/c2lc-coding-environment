// @flow

import SoundexTable from './SoundexTable';
import WebSpeechEventProcessor from './WebSpeechEventProcessor';

type OnWordCallback = { (string): void };

export default class WebSpeechInput {
    onWord: OnWordCallback;
    speechRecognitionInstance: any;
    eventProcessor: WebSpeechEventProcessor;

    constructor(soundexTable: SoundexTable, onWord: OnWordCallback) {
        this.onWord = onWord;

        this.speechRecognitionInstance = new window.webkitSpeechRecognition();
        this.speechRecognitionInstance.lang = 'en-CA';
        this.speechRecognitionInstance.continuous = true;
        this.speechRecognitionInstance.interimResults = true;
        this.speechRecognitionInstance.maxAlternatives = 1;
        this.speechRecognitionInstance.onresult = this.handleResult;

        this.eventProcessor = new WebSpeechEventProcessor(soundexTable);
    }

    start() {
        this.speechRecognitionInstance.start();
    }

    stop() {
        this.speechRecognitionInstance.stop();
    }

    handleResult = (event: any) => {
        // this.logSpeechRecognitionEvent(event);
        const words = this.eventProcessor.processEvent(event);
        for (const word of words) {
            this.onWord(word);
        }
    };

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
