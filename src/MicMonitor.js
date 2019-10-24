// @flow

import React from 'react';

// This component is a thin wrapper over the ReactMic component. It provides
// dynamic loading of the 'react-mic' module to facilitate importing of this
// component module in environments that do not provide the Web AudioContext
// API. This is necessary as the 'react-mic' module attempts to construct an
// AudioContext instance at import.

type MicMonitorProps = {
    enabled: boolean
};

type MicMonitorState = {
    reactMicLoaded: boolean
};

export default class MicMonitor extends React.Component<MicMonitorProps, MicMonitorState> {
    reactMicModule: any;

    constructor(props: MicMonitorProps) {
        super(props);
        this.state = {
            reactMicLoaded: false
        };
        // Import 'react-mic' only if the AudioContext API is available
        if (window.AudioContext || window.webkitAudioContext) {
            import('react-mic').then((reactMicModule) => {
                this.reactMicModule = reactMicModule;
                this.setState({
                    reactMicLoaded: true
                });
            });
        }
    }

    render() {
        if (this.state.reactMicLoaded) {
            return React.createElement(this.reactMicModule.ReactMic, {
                record: this.props.enabled,
                strokeColor: '#FFFFFF',
                backgroundColor: '#444444'
            });
        } else {
            return <span></span>;
        }
    }
}
