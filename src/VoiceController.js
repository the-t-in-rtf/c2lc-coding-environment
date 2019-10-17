// @flow

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ReactMic } from 'react-mic';

type VoiceControllerProps = {
    speechRecognitionOn: boolean,
    onStartSpeechRecognition: { (): void },
    onStopSpeechRecognition: { (): void }
};

export default class VoiceController extends React.Component<VoiceControllerProps, {}> {
    constructor(props: VoiceControllerProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <ReactMic
                    record={this.props.speechRecognitionOn}
                    className="sound-wave"
                    strokeColor="#000000"
                    backgroundColor="#FF4081" />
                <button onClick={this.props.onStartSpeechRecognition} type="button">
                    <FormattedMessage id='VoiceController.start' />
                </button>
                <button onClick={this.props.onStopSpeechRecognition} type="button">
                    <FormattedMessage id='VoiceController.stop' />
                </button>
            </div>
        )
    }
}
