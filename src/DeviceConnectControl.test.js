// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { createIntl } from 'react-intl';
import type {DeviceConnectionStatus} from './types';
import messages from './messages.json';
import DeviceConnectControl from './DeviceConnectControl';

configure({ adapter: new Adapter()});

function hasDisabledClass(wrapper) {
    return wrapper.find('.DeviceConnectControl').hasClass('DeviceConnectControl--disabled');
}

function buttonIsDisabled(wrapper) {
    return wrapper.find('.DeviceConnectControl__button').getElement().props['disabled'];
}

function getStatusIconContainer(wrapper) {
    return wrapper.find('.DeviceConnectControl__status-icon-container').childAt(0).getElement();
}

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

test('Connect button should not have disabled class name when disabled prop is false', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='notConnected'
            onClickConnect={() => {}}/>
    );
    expect(hasDisabledClass(wrapper)).toBe(false);
    expect(buttonIsDisabled(wrapper)).toBe(false);
});

test('Connect button should have disabled class name when disabled prop is true', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={true}
            connectionStatus='notConnected'
            onClickConnect={() => {}}/>
    );
    expect(hasDisabledClass(wrapper)).toBe(true);
    expect(buttonIsDisabled(wrapper)).toBe(true);
});

test('There should be no status icon for notConnected status', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='notConnected'
            onClickConnect={() => {}}/>
    );
    expect(wrapper.find('.DeviceConnectControl__status-icon-container').childAt(0)).toHaveLength(0);
});

test('Checking icon and aria-label for connected status', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='connected'
            onClickConnect={() => {}}/>
    );
    expect(getStatusIconContainer(wrapper).props['aria-label']).toBe(intl.messages['DeviceConnectControl.connected']);
    expect(getStatusIconContainer(wrapper).props.role).toBe('img');
    expect(getStatusIconContainer(wrapper).props.children.props.style.opacity).toBe('100%');
});

test('Checking icon and aria-label for connecting status', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='connecting'
            onClickConnect={() => {}}/>
    );
    expect(getStatusIconContainer(wrapper).props.role).toBe('status');
    expect(getStatusIconContainer(wrapper).props['aria-label']).toBe(intl.messages['DeviceConnectControl.connecting']);
    expect(getStatusIconContainer(wrapper).props.children[0].props.style.opacity).toBe('50%');
    expect(getStatusIconContainer(wrapper).props.children[1].type.render.name).toBe('SvgConnecting');
});
