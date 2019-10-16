// @flow

import React from 'react';
import { ReactMic } from 'react-mic';
import SoundexTable from './SoundexTable';
import SpeechRecognitionWrapper from './SpeechRecognitionWrapper';

type VoiceControllerProps = {
    voiceInput: (string) => void,
    run: () => void,
    cancel: () => void
};

type VoiceControllerState = {
    speechRecognitionOn: boolean
};

export default class VoiceController extends React.Component<VoiceControllerProps, VoiceControllerState> {
    speechRecognitionWrapper: SpeechRecognitionWrapper;

    constructor(props: VoiceControllerProps) {
        super(props);

        this.state = {
            speechRecognitionOn: false
        };

        // TODO: Move this out
        const soundexTable = new SoundexTable([
            { pattern: /F6../, word: 'forward' },
            { pattern: /O6../, word: 'forward' },
            { pattern: /L1../, word: 'left' },
            { pattern: /L2../, word: 'left' },
            { pattern: /L3../, word: 'left' },
            { pattern: /L.3./, word: 'left' },
            { pattern: /L..3/, word: 'left' },
            { pattern: /R3../, word: 'right' },
            { pattern: /R.3./, word: 'right' },
            { pattern: /R..3/, word: 'right' }
        ]);

        // TODO: Move this out
        this.speechRecognitionWrapper = new SpeechRecognitionWrapper(
            soundexTable,
            this.handleWord);
    }

    handleStartSpeechRecognition = () => {
        this.setState({
            speechRecognitionOn: true
        });
    };

    handleStopSpeechRecognition = () => {
        this.setState({
            speechRecognitionOn: false
        });
    };

    handleWord = (word: string) => {
        this.props.voiceInput(word);
    };

    render() {
        return (
            <div>
                <ReactMic
                    record={this.state.speechRecognitionOn}
                    className="sound-wave"
                    strokeColor="#000000"
                    backgroundColor="#FF4081" />
                <button onClick={this.handleStartSpeechRecognition} type="button">Start</button>
                <button onClick={this.handleStopSpeechRecognition} type="button">Stop</button>
            </div>
        )
    }

    componentDidUpdate(prevProps: {}, prevState: VoiceControllerState) {
        if (this.state.speechRecognitionOn !== prevState.speechRecognitionOn) {
            if (this.state.speechRecognitionOn) {
                this.speechRecognitionWrapper.start();
            } else {
                this.speechRecognitionWrapper.stop();
            }
        }
    }
}
