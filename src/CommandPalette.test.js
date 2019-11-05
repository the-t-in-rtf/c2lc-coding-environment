import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Nav, Tab, Tabs } from 'react-bootstrap';
import CommandPalette from './CommandPalette';
import CommandPaletteCategory from './CommandPaletteCategory';

configure({ adapter: new Adapter()});

test('number of tabs rendered by CommandPalette component should be equal to number of categories', () => {
    const twoCategoryWrapper = shallow(
        <CommandPalette defaultActiveKey='movements'>
            <CommandPaletteCategory eventKey='movements' title='Movements'/>
            <CommandPaletteCategory eventKey='sounds' title='Sounds'/>
        </CommandPalette>
    );
    let tabs = twoCategoryWrapper.find(CommandPaletteCategory);
    expect(tabs).toHaveLength(2);

    const threeCategoryWrapper = shallow(
        <CommandPalette defaultActiveKey='movements'>
            <CommandPaletteCategory eventKey='movements' title='Movements'/>
            <CommandPaletteCategory eventKey='sounds' title='Sounds'/>
            <CommandPaletteCategory eventKey='programs' title='Programs' />
        </CommandPalette>
    );
    tabs = threeCategoryWrapper.find(CommandPaletteCategory);
    expect(tabs).toHaveLength(3);
});

test('changing tabs active/inactive state with click event', () => {
    const commandPaletteDom = mount(
        <CommandPalette defaultActiveKey='movements'>
            <CommandPaletteCategory id='movements' eventKey='movements' title='Movements'/>
            <CommandPaletteCategory id='sounds' eventKey='sounds' title='Sounds'/>
        </CommandPalette>
    );
    const getActiveTab = () => (commandPaletteDom.find('a.nav-link.active'));
    const getInactiveTab = () => (commandPaletteDom.find('a.nav-link').not('.active'));
    // initial active tab should be equal to defaultActiveKey 
    expect(getActiveTab().get(0).props['data-rb-event-key']).toBe('movements');
    expect(getInactiveTab().get(0).props['data-rb-event-key']).toBe('sounds');

    // when you click inactive tab, active tab should be changed to it
    getInactiveTab().simulate('click');
    expect(getActiveTab().get(0).props['data-rb-event-key']).toBe('sounds');
    expect(getInactiveTab().get(0).props['data-rb-event-key']).toBe('movements');
});