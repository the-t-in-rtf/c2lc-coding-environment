// @flow

import React from 'react';
import { ReactMic } from 'react-mic';

type VoiceControllerProps = {
    voiceInput: (string) => void,
    run: () => void,
    cancel: () => void,
    home: () => void,
    clear: () => void,
    deleteAll: () => void
};

type VoiceControllerState = {
    speechRecognitionOn: boolean
};

export default class VoiceController extends React.Component<VoiceControllerProps, VoiceControllerState> {
    recognition: any;

    constructor(props: VoiceControllerProps) {
        super(props);

        this.state = {
            speechRecognitionOn: false
        };

        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = 'en-CA';
        this.recognition.onresult = this.onSpeechRecognitionResult.bind(this);
    }

    startSpeechRecognition = () => {
        this.setState((state) => {
            if (!state.speechRecognitionOn) {
                this.recognition.start();
            }
            return {
                speechRecognitionOn: true
            };
        });
    }

    stopSpeechRecognition = () => {
        this.setState((state) => {
            if (state.speechRecognitionOn) {
                this.recognition.stop();
            }
            return {
                speechRecognitionOn: false
            };
        });
    }

    onSpeechRecognitionResult(event: any) {
        if (event.results != null) {
            let speechResult = event.results[event.results.length-1][0].transcript.toLowerCase();
            if (speechResult.includes('forward')) {
                this.props.voiceInput('forward');
            } else if (speechResult.includes('left')) {
                this.props.voiceInput('left');
            } else if (speechResult.includes('right')) {
                this.props.voiceInput('right');
            } else if (speechResult.includes('run')) {
                this.props.run();
            } else if (speechResult.includes('never mind') || speechResult.includes('delete') || speechResult.includes('cancel') || speechResult.includes('back')) {
                this.props.cancel();
            } else if (speechResult.includes('home')) {
                //this.props.home();
            } else if (speechResult.includes('clear')) {
                //this.props.clear();
            } else if (speechResult.includes('reset')) {
                //this.props.deleteAll();
            }
        }
    };

    render() {
        return (
            <div>
                <ReactMic
                    record={this.state.speechRecognitionOn}
                    className="sound-wave"
                    strokeColor="#000000"
                    backgroundColor="#FF4081" />
                <button onClick={this.startSpeechRecognition} type="button">Start</button>
                <button onClick={this.stopSpeechRecognition} type="button">Stop</button>
            </div>
        )
    }
}
