// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import ActionPanel from './ActionPanel';
import messages from './messages.json';

configure({ adapter: new Adapter()});

const defaultActionPanelProps = {
    focusedOptionName: null,
    selectedCommandName: null,
    program: ['forward', 'left', 'right'],
    pressedStepIndex: 1,
    position: {
        top: 0,
        right: 0
    },
};

function createShallowActionPanel(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockDeleteHandler = jest.fn();
    const mockReplaceHandler = jest.fn();
    const mockMoveToPreviousStep = jest.fn();
    const mockMoveToNextStep = jest.fn();

    const wrapper = shallow(
        React.createElement(
            ActionPanel.WrappedComponent,
            Object.assign(
                {},
                defaultActionPanelProps,
                {
                    intl: intl,
                    onDelete: mockDeleteHandler,
                    onReplace: mockReplaceHandler,
                    onMoveToPreviousStep: mockMoveToPreviousStep,
                    onMoveToNextStep: mockMoveToNextStep
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockDeleteHandler,
        mockReplaceHandler,
        mockMoveToPreviousStep,
        mockMoveToNextStep
    };
}

function getActionPanelOptionButtons(actionPanelWrapper, optionName) {
    return actionPanelWrapper.find('.ActionPanel__panel').children(Button[name=`${optionName}`]).at(0);
}

describe('ActionPanel options', () => {
    test('When the delete option is selected', () => {
        const { wrapper, mockDeleteHandler } = createShallowActionPanel();
        const deleteButton = getActionPanelOptionButtons(wrapper);
        console.log(deleteButton.get(0).props)
    });
});
