import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Col, Button } from 'react-bootstrap';
import App from './App';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('onChange property of CommandPaletteCommand component should change state of App component, as well as variant of itself', () => {
    const mockChangeHandler = jest.fn();
    const commandPaletteCommandWrapper = shallow(
        <CommandPaletteCommand 
            commandName='forward' 
            selectedCommandName='none'
            onChange={mockChangeHandler}/>
    );

    const getVariantValue = () => (commandPaletteCommandWrapper.find(Button).getElement().props.variant);

    // before a command is selected, initial state of selectedCommandName of App should be none and variant of the command button should be set to light
    expect(getVariantValue()).toBe('light');

    const commandButton = commandPaletteCommandWrapper.find(Button);

    // after a command is selected, state of selectedCommandName of App should be set to the command name and variant of the command button should be set to outline-primary
    commandButton.simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toBe('forward');
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'forward'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('outline-primary');
    
    // after a command is selected again, state of selectedCommandName of App should reset to none and variant of the command button to light
    commandButton.simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toBe('none');
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'none'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('light');

    // when some other command is clicked 
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'left'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('light');
});