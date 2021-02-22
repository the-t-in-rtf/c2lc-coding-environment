// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import WorldSelector from './WorldSelector';
import type { WorldName } from './types';

configure({ adapter: new Adapter() });

function createMountWorldSelector(props) {
    const wrapper = mount(
        React.createElement(
            WorldSelector,
            {
                onSelect: (value: WorldName) => {}
            }
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

    return wrapper;
}

function getWorldSelector(wrapper) {
    return wrapper.find('.WorldSelector');
}

describe('When rendering selector options', () => {
    test('there should be default, forest, and space options', () => {
        expect.assertions(3);
        const wrapper = createMountWorldSelector();
        const selectorOptions = getWorldSelector(wrapper).get(0).props.children;
        expect(selectorOptions[0].props.eventKey).toBe('default');
        expect(selectorOptions[1].props.eventKey).toBe('space');
        expect(selectorOptions[2].props.eventKey).toBe('forest');
    });
})

