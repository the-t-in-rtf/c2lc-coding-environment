// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import type {DeviceConnectionStatus} from './types';
import { ReactComponent as DashConnectionIcon } from './svg/Dash-Small.svg';
import { ReactComponent as ConnectingIcon } from './svg/Connecting.svg';
import './DeviceConnectControl.scss';

type DeviceConnectControlProps = {
    intl: any,
    children: React.Element<any>, // Button contents
    disabled: boolean,
    connectionStatus: DeviceConnectionStatus,
    onClickConnect: () => void
};

class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    connectionStatusIcon() {
        switch (this.props.connectionStatus) {
            case 'connected':
                return (
                    <span
                        role='img'
                        aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.connected'})}>
                        <DashConnectionIcon className='DeviceConnectControl__dash-icon DeviceConnectControl__dash-icon--connected' />
                    </span>
                );
            case 'connecting':
                return (
                    <span
                        role='status'
                        aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.connecting'})}>
                        <DashConnectionIcon className='DeviceConnectControl__dash-icon' />
                        <ConnectingIcon className='DeviceConnectControl__status-icon' />
                    </span>
                );
            default:
                return null;
        }

    }

    render() {
        let classNames = ['DeviceConnectControl'];
        if (this.props.disabled) {
            classNames.push('DeviceConnectControl--disabled')
        }
        return (
            <div className={classNames.join(' ')}>
                <span className='DeviceConnectControl__status-icon-container'>
                    {this.connectionStatusIcon()}
                </span>
                <Button
                    className='DeviceConnectControl__button'
                    disabled={
                        this.props.disabled ||
                        this.props.connectionStatus === 'connected'}
                    onClick={this.props.onClickConnect}>
                    {this.props.children}
                </Button>
            </div>
        );
    }
}

export default injectIntl(DeviceConnectControl);
