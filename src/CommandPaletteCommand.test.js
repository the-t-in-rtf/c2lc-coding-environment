import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Col, Button } from 'react-bootstrap';
import App from './App';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('onChange property of CommandPaletteCommand component should change its variant according to selectedCommandName', () => {
    const mockChangeHandler = jest.fn();
    const commandPaletteCommandWrapper = shallow(
        <CommandPaletteCommand 
            commandName='forward' 
            selectedCommandName='none'
            onChange={mockChangeHandler}/>
    );

    const getVariantValue = () => (commandPaletteCommandWrapper.find(Button).getElement().props.variant);

    // before a command is selected, initial command button's variant should be set to light
    expect(getVariantValue()).toBe('light');

    const commandButton = commandPaletteCommandWrapper.find(Button);

    // after a command is selected, variant of the command button should be set to outline-primary
    commandButton.simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toBe('forward');
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'forward'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('outline-primary');
    
    // after the same command is selected, variant of the command button should be reset to light
    commandButton.simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toBe('none');
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'none'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('light');

    // when another command is clicked, variant of the command button should be unchanged  
    commandPaletteCommandWrapper.setProps({selectedCommandName: 'left'});
    commandPaletteCommandWrapper.update();
    expect(getVariantValue()).toBe('light');
});