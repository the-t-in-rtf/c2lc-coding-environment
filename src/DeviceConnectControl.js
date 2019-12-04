// @flow

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Image, Spinner } from 'react-bootstrap';
import type {DeviceConnectionStatus} from './types';
import connected from './svg/Status_Connected.svg';
import notConnected from './svg/Status_NotConnected.svg';
import './DeviceConnectControl.css'

type DeviceConnectControlProps = {
    intl: any,
    children: React.Element<any>, // Button contents
    onClickConnect: () => void,
    connectionStatus: DeviceConnectionStatus
};

class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    render() {
        return (
            <div>
                <button
                    className='DeviceConnectControl__connect-button'
                    onClick={this.props.onClickConnect}>
                    {this.props.children}
                </button>
                {this.props.connectionStatus === 'connected' ?
                    <Image
                        src={connected}
                        alt={this.props.intl.formatMessage({id:'DeviceConnectControl.connected'})}
                        className='DeviceConnectControl__dash-status-svg' /> :
                    this.props.connectionStatus === 'connecting' ?
                        <>
                            <Spinner
                                className='DeviceConnectControl__dash-status-svg'
                                animation='border'
                                role='status'
                                size='sm'/>
                            <span className="sr-only">
                                <FormattedMessage id={'DeviceConnectControl.connecting'} />
                            </span>
                        </> :
                        <Image
                            src={notConnected}
                            alt={this.props.intl.formatMessage({id:'DeviceConnectControl.notConnected'})}
                            className='DeviceConnectControl__dash-status-svg' />}
            </div>
        );
    }
}

export default injectIntl(DeviceConnectControl);
