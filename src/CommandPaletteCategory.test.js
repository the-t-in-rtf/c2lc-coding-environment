import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { Row } from 'react-bootstrap';
import CommandPaletteCategory from './CommandPaletteCategory';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

test('number of commands rendered by CommandPaletteCategory should be equal to the number of CommandPaletteCommand', () => {
    const twoCommandsWrapper = shallow(
        <CommandPaletteCategory>
            <CommandPaletteCommand commandName='forward'/>
            <CommandPaletteCommand commandName='left'/>
        </CommandPaletteCategory>
    );
    let commands = twoCommandsWrapper.find(Row);
    let commandsChildren = commands.getElement().props.children;
    expect(commandsChildren).toHaveLength(2);

    const threeCommandsWrapper = shallow(
        <CommandPaletteCategory>
            <CommandPaletteCommand commandName='forward'/>
            <CommandPaletteCommand commandName='left'/>
            <CommandPaletteCommand commandName='right'/>
        </CommandPaletteCategory>
    );
    
    commands = threeCommandsWrapper.find(Row);
    commandsChildren = commands.getElement().props.children;
    expect(commandsChildren).toHaveLength(3);

    const fourCommandsWrapper = shallow(
        <CommandPaletteCategory>
            <CommandPaletteCommand commandName='forward' />
            <CommandPaletteCommand commandName='left' />
            <CommandPaletteCommand commandName='right' />
            <CommandPaletteCommand commandName='none' />
        </CommandPaletteCategory>
    );
    commands = fourCommandsWrapper.find(Row);
    commandsChildren = commands.getElement().props.children;
    expect(commandsChildren).toHaveLength(4);
});