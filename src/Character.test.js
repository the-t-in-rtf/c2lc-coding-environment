// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import Character from './Character';

configure({ adapter: new Adapter() });

const defaultCharacterProps = {
    theme: 'default',
    transform: '',
    width: 3
};

function createMountRobotChracter(props) {
    const wrapper = mount(
        React.createElement(
            Character,
            Object.assign(
                {},
                defaultCharacterProps,
                props
            )
        )
    );

    return wrapper;
}

function findCharacter(wrapper) {
    return wrapper.find('.Character__icon');
}

describe('Right character should render based on theme props', () => {
    test('default', () => {
        expect.assertions(1);
        const robotCharacterWrapper = createMountRobotChracter();
        expect(findCharacter(robotCharacterWrapper).get(0).type.render().props.children).toBe('Robot.svg');
    });
    test('forest', () => {
        expect.assertions(1);
        const robotCharacterWrapper = createMountRobotChracter({theme: 'forest'});
        expect(findCharacter(robotCharacterWrapper).get(0).type.render().props.children).toBe('Rabbit.svg');
    });
    test('space', () => {
        expect.assertions(1);
        const robotCharacterWrapper = createMountRobotChracter({theme: 'space'});
        expect(findCharacter(robotCharacterWrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
    });
})
