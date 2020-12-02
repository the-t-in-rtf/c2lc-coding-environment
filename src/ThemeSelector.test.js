// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import ThemeSelector from './ThemeSelector';

configure({ adapter: new Adapter() });

function createMountThemeSelector(props) {
    const mockSelectHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ThemeSelector,
            Object.assign(
                {
                    onSelect: mockSelectHandler
                },
                props
            )
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return {
        wrapper,
        mockSelectHandler
    };
}

function getThemeSelector(wrapper) {
    return wrapper.find('.ThemeSelector');
}

describe('When rendering selector options', () => {
    test('there should be default, forest, and space options', () => {
        expect.assertions(3);
        const { wrapper } = createMountThemeSelector();
        const selectorOptions = getThemeSelector(wrapper).get(0).props.children;
        expect(selectorOptions[0].props.eventKey).toBe('default');
        expect(selectorOptions[1].props.eventKey).toBe('space');
        expect(selectorOptions[2].props.eventKey).toBe('forest');
    });
})

