// @flow

import React from 'react';
import { ReactMic } from 'react-mic';

type MicMonitorProps = {
    enabled: boolean,
};

export default class MicMonitor extends React.Component<MicMonitorProps, {}> {
    render() {
        return (
            <ReactMic
                record={this.props.enabled}
                className="sound-wave"
                strokeColor="#000000"
                backgroundColor="#FF4081" />
        )
    }
}
