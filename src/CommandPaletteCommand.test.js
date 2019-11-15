import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Col, Button } from 'react-bootstrap';
import { createIntl } from 'react-intl';
import App from './App';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('onChange property of CommandPaletteCommand component should change its variant according to selectedCommandName', () => {
    const mockChangeHandler = jest.fn();
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: {
            'CommandPaletteCommand.forward' : 'forward'
        }
    });

    const commandPaletteCommandWrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward'
            selectedCommandName={null}
            onChange={mockChangeHandler}/>
    )

    const getVariantValue = () => (commandPaletteCommandWrapper.find(Button).getElement().props.variant);
    const getAriaPressedValue = () => (commandPaletteCommandWrapper.find(Button).getElement().props['aria-pressed']);
    // before a command is selected, initial command button's variant should be set to light and aria-pressed value should be false
    expect(getVariantValue()).toBe('light');
    expect(getAriaPressedValue()).toBe('false');

    const commandButton = commandPaletteCommandWrapper.find(Button);

    // after a command is selected, variant of the command button should be set to outline-primary and aria-pressed value should be true
    commandButton.simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toBe('forward');
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'forward'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('outline-primary');
    expect(getAriaPressedValue()).toBe('true');

    // after the same command is selected, variant of the command button should be reset to light
    commandButton.simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toBe(null);
    commandPaletteCommandWrapper.setProps({selectedCommandName: null});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('light');
    expect(getAriaPressedValue()).toBe('false');

    // when another command is clicked, variant and aria-pressed of the command button should be unchanged
    //commandPaletteCommandWrapper.setProps({selectedCommandName: 'left'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('light');
    expect(getAriaPressedValue()).toBe('false');
});
