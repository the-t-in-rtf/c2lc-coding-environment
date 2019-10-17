// @flow

import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import type {DeviceConnectionStatus} from './types';

type DeviceConnectControlProps = {
    children: React.Element<any>, // Button contents
    onClickConnect: () => void,
    connectionStatus: DeviceConnectionStatus
};

export default class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    render() {
        return (
            <div>
                <button onClick={this.props.onClickConnect}>{this.props.children}</button>
                <FormattedMessage id={`DeviceConnectControl.${this.props.connectionStatus}`} />
            </div>
        );
    }
}
