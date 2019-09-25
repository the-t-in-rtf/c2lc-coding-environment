// @flow

import React from 'react';
import type {DeviceConnectionStatus} from './types';

type DeviceConnectControlProps = {
    buttonText: string,
    onClickConnect: () => void,
    connectionStatus: DeviceConnectionStatus
};

// TODO: Localize connection status message

export default class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    render() {
        return (
            <div>
                <button onClick={this.props.onClickConnect}>{this.props.buttonText}</button>
                <span>{this.props.connectionStatus}</span>
            </div>
        );
    }
}
