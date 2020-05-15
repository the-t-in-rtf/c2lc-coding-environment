// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import App from './App';
import AriaDisablingButton from './AriaDisablingButton';
import messages from './messages.json';
import AddNodeToggleSwitch from './AddNodeToggleSwitch';

configure({ adapter: new Adapter()});

const defaultAddNodeToggleSwitchProps = {
    isAddNodeExpandedMode: false
};

function createShallowAddNodeToggleSwitch(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockClickHandler = jest.fn();
    const mockKeyDownHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            AddNodeToggleSwitch.WrappedComponent,
            Object.assign(
                {},
                defaultAddNodeToggleSwitchProps,
                {
                    intl: intl,
                    onClick: mockClickHandler,
                    onKeyDown: mockKeyDownHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockClickHandler,
        mockKeyDownHandler
    };
}

function getAddNodeToggleSwitch(addNodeToggleSwitchWrapper) {
    return addNodeToggleSwitchWrapper.find('.AddNodeToggleSwitch__switch').at(0);
}

describe('AddNodeToggleSwitch', () => {
    test('Should be unchecked when isAddNodeExpandedMode prop is false', () => {
        const { wrapper } = createShallowAddNodeToggleSwitch();
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper).get(0);
        expect(addNodeToggleSwitch.props['aria-checked']).toBe(false);
    });

    test('Should be checked when isAddNodeExpandedMode prop is true', () => {
        const { wrapper } = createShallowAddNodeToggleSwitch({isAddNodeExpandedMode: true});
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper).get(0);
        expect(addNodeToggleSwitch.props['aria-checked']).toBe(true);
        expect(addNodeToggleSwitch.props.className.includes('--checked')).toBe(true);
    });
});
