// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import messages from './messages.json';
import AddNodeToggleSwitch from './AddNodeToggleSwitch';

configure({ adapter: new Adapter()});

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
                {
                    intl: intl,
                    isAddNodeExpandedMode: false,
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

describe('Given isAddNodeExpandedMode is false', () => {
    let wrapper, mockChangeHandler;

    beforeEach(() => {
        ({ wrapper, mockChangeHandler } = createShallowAddNodeToggleSwitch({
            isAddNodeExpandedMode: false
        }));
    });

    test('It should be unchecked', () => {
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper);
        expect(addNodeToggleSwitch.prop('aria-checked')).toBe(false);
        expect(addNodeToggleSwitch.hasClass('AddNodeToggleSwitch--checked')).toBe(false);
    });

    test('When clicked, then onChange should be called with true', () => {
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper);
        addNodeToggleSwitch.simulate('click');
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(true);
    });

    test('When type space key, then onChange should be called with true', () => {
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper);
        addNodeToggleSwitch.simulate('keyDown', {key: ' ', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(true);
    });
});

describe('Given isAddNodeExpandedMode is true', () => {
    let wrapper, mockChangeHandler;

    beforeEach(() => {
        ({ wrapper, mockChangeHandler } = createShallowAddNodeToggleSwitch({
            isAddNodeExpandedMode: true
        }));
    });

    test('It should be checked', () => {
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper);
        expect(addNodeToggleSwitch.prop('aria-checked')).toBe(true);
        expect(addNodeToggleSwitch.hasClass('AddNodeToggleSwitch--checked')).toBe(true);
    });

    test('When clicked, then onChange should be called with false', () => {
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper);
        addNodeToggleSwitch.simulate('click');
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(false);
    });

    test('When type space key, then onChange should be called with false', () => {
        const addNodeToggleSwitch = getAddNodeToggleSwitch(wrapper);
        addNodeToggleSwitch.simulate('keyDown', {key: ' ', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(false);
    });
});
