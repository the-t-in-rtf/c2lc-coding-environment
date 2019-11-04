import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Col, Button } from 'react-bootstrap';
import App from './App';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('onChange property of CommandPaletteCommand component should change state of App component, as well as variant of itself', () => {
    const appWrapper = shallow(<App />);
    // maybe no need to create mockFn? if there's way to access the function directly from App
    const mockFn = jest.fn(command => {
        appWrapper.setState({selectedCommandName : command});        
    });
    const commandPaletteCommandWrapper = shallow(
        <CommandPaletteCommand 
            commandName='forward' 
            selectedCommandName={appWrapper.state().selectedCommandName} 
            onChange={mockFn}/>
    );
    const commandButton = commandPaletteCommandWrapper.find(Button);
    const getVariantValue = () => (commandPaletteCommandWrapper.find(Button).getElement().props.variant);
    // before a command is selected, initial state of selectedCommandName of App should be none and variant of the command button should be set to light
    expect(appWrapper.state().selectedCommandName).toBe('none');
    expect(getVariantValue()).toBe('light');

    // after a command is selected, state of selectedCommandName of App should be set to the command name and variant of the command button should be set to outline-primary
    commandButton.simulate('click');
    commandPaletteCommandWrapper.setProps({selectedCommandName: appWrapper.state().selectedCommandName});
    commandPaletteCommandWrapper.update();
    expect(appWrapper.state().selectedCommandName).toBe('forward');
    expect(getVariantValue()).toBe('outline-primary');
    
    // after a command is selected again, state of selectedCommandName of App should reset to none and variant of the command button to light
    commandButton.simulate('click');
    commandPaletteCommandWrapper.setProps({selectedCommandName: appWrapper.state().selectedCommandName});
    commandPaletteCommandWrapper.update();
    expect(appWrapper.state().selectedCommandName).toBe('none');
    expect(getVariantValue()).toBe('light');
});