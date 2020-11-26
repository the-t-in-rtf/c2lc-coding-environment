// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import RobotCharacter from './RobotCharacter';

configure({ adapter: new Adapter() });

const defaultRobotCharacterProps = {
    theme: 'default',
    transform: '',
    width: 3
};

function createMountRobotChracter(props) {
    const wrapper = mount(
        React.createElement(
            RobotCharacter,
            Object.assign(
                {},
                defaultRobotCharacterProps,
                props
            )
        )
    );

    return wrapper;
}

function findRobotCharacter(wrapper) {
    return wrapper.find('.RobotCharacter__icon');
}

describe('Right character should render based on theme props', () => {
    test('default', () => {
        expect.assertions(1);
        const robotCharacterWrapper = createMountRobotChracter();
        expect(findRobotCharacter(robotCharacterWrapper).get(0).type.render().props.children).toBe('Robot.svg');
    });
    test('forest', () => {
        expect.assertions(1);
        const robotCharacterWrapper = createMountRobotChracter({theme: 'forest'});
        expect(findRobotCharacter(robotCharacterWrapper).get(0).type.render().props.children).toBe('Rabbit.svg');
    });
    test('space', () => {
        expect.assertions(1);
        const robotCharacterWrapper = createMountRobotChracter({theme: 'space'});
        expect(findRobotCharacter(robotCharacterWrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
    });
})
