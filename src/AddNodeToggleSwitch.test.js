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

    const mockChangeHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            AddNodeToggleSwitch.WrappedComponent,
            Object.assign(
                {},
                defaultAddNodeToggleSwitchProps,
                {
                    intl: intl,
                    onChange: mockChangeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockChangeHandler
    };
}

function getAddNodeToggleSwitch(addNodeToggleSwitchWrapper) {
    return addNodeToggleSwitchWrapper.find('.AddNodeToggleSwitch').at(0);
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

    test('Should call the change handler on click and space keydown', () => {
        const { wrapper, mockChangeHandler } = createShallowAddNodeToggleSwitch();
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper).at(0);
        addNodeToggleSwitch.simulate('click');
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        addNodeToggleSwitch.simulate('keyDown', {key: ' ', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(2);
    })
});
