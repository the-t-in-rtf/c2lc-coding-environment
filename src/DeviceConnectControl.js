// @flow

import React from 'react';
import type {DeviceConnectionStatus} from './types';

type DeviceConnectControlProps = {
    onClickConnect: () => void,
    connectionStatus: DeviceConnectionStatus
};

// TODO: Parameterize button text
// TODO: Localize connection status message

export default class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    render() {
        return (
            <div>
                <button onClick={this.props.onClickConnect}>Connect</button>
                <span>{this.props.connectionStatus}</span>
            </div>
        );
    }
}
