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
        const dashIconStyle = {
            opacity: '50%',
            width: '2.5rem',
            height: '2.5rem',
            position: 'relative',
            top: '0.1rem'
        };

        switch (this.props.connectionStatus) {
            case 'connected':
                dashIconStyle.opacity = '100%';
                return (
                    <span
                        role='img'
                        aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.connected'})}>
                        <DashConnectionIcon
                            style={dashIconStyle}
                        />
                    </span>
                );
            case 'connecting':
                return (
                    <span>
                        <DashConnectionIcon
                            style={dashIconStyle}
                        />
                        <ConnectingIcon
                            className='DeviceConnectControl__status-icon'/>
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
