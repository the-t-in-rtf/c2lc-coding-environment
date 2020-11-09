// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ProgramSpeedController from './ProgramSpeedController';
import messages from './messages.json';

configure({ adapter: new Adapter()});

function createMountProgramSpeedController(props) {
    const wrapper = mount(
        React.createElement(
            ProgramSpeedController,
            props
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return {
        wrapper
    };
}

function getProgramSpeedController(programSpeedControllerWrapper) {
    return programSpeedControllerWrapper.find('.ProgramSpeedController__slider').at(0);
}

describe('When value from the controller changes', () => {
    test('Should call onChange callback with value from speedLookUp at index value-1', () => {
        expect.assertions(2);
        const mockOnChange = jest.fn();
        const speedLookUp = [2000, 1500, 1000, 500, 250];
        const { wrapper } = createMountProgramSpeedController({
            onChange: mockOnChange,
            speedLookUp
        });
        const programSpeedController = getProgramSpeedController(wrapper);
        const targetValue = 4;
        programSpeedController.simulate('change', { target: { value: targetValue}});
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe(speedLookUp[targetValue-1]);
    })
});
