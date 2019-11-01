import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Container } from 'react-bootstrap';
import CommandPaletteCategory from './CommandPaletteCategory';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('number of commands rendered by CommandPaletteCategory should be equal to the number of CommandPaletteCommand', () => {
    const wrapper = shallow(
        <CommandPaletteCategory>
            <CommandPaletteCommand commandName='forward'/>
            <CommandPaletteCommand commandName='left'/>
            <CommandPaletteCommand commandName='right'/>
        </CommandPaletteCategory>
    );
    const commands = wrapper.find(Container);
    const commandsChildren = commands.getElement().props.children.props.children;
    expect(commandsChildren).toHaveLength(3);
});