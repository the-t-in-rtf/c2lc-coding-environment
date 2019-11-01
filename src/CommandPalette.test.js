import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Nav, Tab } from 'react-bootstrap';
import CommandPalette from './CommandPalette';

configure({ adapter: new Adapter()});

test('number of tabs rendered by CommandPalette component should be equal to number of categories', () => {
    const childrenNode = [
        {category : {
            props : {
                eventKey : 'movements',
                title : 'Movements'
            }
        }},
        {category : {
            props : {
                eventKey : 'sounds',
                title : 'Sounds'
            }
        }}
    ];
    const wrapper = shallow(<CommandPalette childrenNode={childrenNode} />);
    const Tabs = wrapper.find(Tab.Container);
    const tabsChildren = Tabs.getElement().props.children;
    expect(tabsChildren).toHaveLength(2);
});