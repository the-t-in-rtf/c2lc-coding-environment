// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
// $FlowFixMe: Flow doesn't know that the RawIntlProvider exists.
import { createIntl, RawIntlProvider } from 'react-intl';
import messages from './messages.json';
import WorldSelector from './WorldSelector';

configure({ adapter: new Adapter() });

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

function createMountWorldSelector(props) {
    const mockOnSelectHandler = jest.fn();
    const wrapper = mount(
        React.createElement(
            WorldSelector,
            {
                onSelect: mockOnSelectHandler
            }
        ),
        {
            // We use the RawIntlProvider so that we can get access to the underlying `intl` instance.
            wrappingComponent: RawIntlProvider,
            wrappingComponentProps: {
                value: intl
            }
        }
    );
    const worldSelector = wrapper.find(WorldSelector).childAt(0);

    return { worldSelector, mockOnSelectHandler };
}

describe('When rendering the WorldSelector', () => {
    test('it should be possible to select a world using mouse input.', () => {
        const {worldSelector, mockOnSelectHandler} = createMountWorldSelector();
        expect(worldSelector.state('world')).toBe('default');

        const robotIcon = worldSelector.childAt(0).childAt(1);
        const rabbitIcon = worldSelector.childAt(0).childAt(2);
        const spaceShipIcon = worldSelector.childAt(0).childAt(3);

        rabbitIcon.simulate('click');

        expect(mockOnSelectHandler.mock.calls.length).toBe(1);
        expect(mockOnSelectHandler.mock.calls[0][0]).toBe('forest');
        expect(worldSelector.state('world')).toBe('forest');


        spaceShipIcon.simulate('click');

        expect(mockOnSelectHandler.mock.calls.length).toBe(2);
        expect(mockOnSelectHandler.mock.calls[1][0]).toBe('space');
        expect(worldSelector.state('world')).toBe('space');

        robotIcon.simulate('click');

        expect(mockOnSelectHandler.mock.calls.length).toBe(3);
        expect(mockOnSelectHandler.mock.calls[2][0]).toBe('default');
        expect(worldSelector.state('world')).toBe('default');
    });

    test('it should be possible to select a world using keyboard input.', () => {
        const {worldSelector, mockOnSelectHandler} = createMountWorldSelector();
        expect(worldSelector.state('world')).toBe('default');

        const robotIcon = worldSelector.childAt(0).childAt(1);
        const rabbitIcon = worldSelector.childAt(0).childAt(2);
        const spaceShipIcon = worldSelector.childAt(0).childAt(3);

        rabbitIcon.simulate('keyDown', {key: ' '});

        expect(mockOnSelectHandler.mock.calls.length).toBe(1);
        expect(mockOnSelectHandler.mock.calls[0][0]).toBe('forest');
        expect(worldSelector.state('world')).toBe('forest');


        spaceShipIcon.simulate('keyDown', {key: ' '});

        expect(mockOnSelectHandler.mock.calls.length).toBe(2);
        expect(mockOnSelectHandler.mock.calls[1][0]).toBe('space');
        expect(worldSelector.state('world')).toBe('space');

        robotIcon.simulate('keyDown', {key: ' '});

        expect(mockOnSelectHandler.mock.calls.length).toBe(3);
        expect(mockOnSelectHandler.mock.calls[2][0]).toBe('default');
        expect(worldSelector.state('world')).toBe('default');
    });

    test('all icons should have ARIA labels.', () => {
        const {worldSelector} = createMountWorldSelector();
        expect(worldSelector.state('world')).toBe('default');

        const worldIcon = worldSelector.childAt(0).childAt(0)
        expect(worldIcon.prop('aria-label')).toBe("World");

        const robotIcon = worldSelector.childAt(0).childAt(1);
        expect(robotIcon.prop('aria-label')).toBe(intl.messages['WorldSelector.world.default']);

        const rabbitIcon = worldSelector.childAt(0).childAt(2);
        expect(rabbitIcon.prop('aria-label')).toBe(intl.messages['WorldSelector.world.forest']);

        const spaceShipIcon = worldSelector.childAt(0).childAt(3);
        expect(spaceShipIcon.prop('aria-label')).toBe(intl.messages['WorldSelector.world.space']);
    });
});
