// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ActionPanel from './ActionPanel';
import messages from './messages.json';

configure({ adapter: new Adapter()});

const defaultActionPanelProps = {
    focusedOptionName: null,
    selectedCommandName: 'right',
    program: ['forward', 'left', 'right'],
    pressedStepIndex: 1,
    position: {
        top: 0,
        right: 0
    },
};

function createMountActionPanel(props) {
    const mockDeleteHandler = jest.fn();
    const mockReplaceHandler = jest.fn();
    const mockMoveToPreviousStep = jest.fn();
    const mockMoveToNextStep = jest.fn();

    const wrapper = mount(
        React.createElement(
            ActionPanel,
            Object.assign(
                {},
                defaultActionPanelProps,
                {
                    onDelete: mockDeleteHandler,
                    onReplace: mockReplaceHandler,
                    onMoveToPreviousStep: mockMoveToPreviousStep,
                    onMoveToNextStep: mockMoveToNextStep
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
        mockDeleteHandler,
        mockReplaceHandler,
        mockMoveToPreviousStep,
        mockMoveToNextStep
    };
}

function getActionPanelOptionButtons(actionPanelWrapper, controlName) {
    return actionPanelWrapper.find({name: controlName}).at(0);
}

describe('ActionPanel options', () => {
    test('When the deleteCurrentStep option is selected on second step turn left of the program', () => {
        const { wrapper, mockDeleteHandler } = createMountActionPanel();
        const deleteButton = getActionPanelOptionButtons(wrapper, 'deleteCurrentStep');
        const expectedAriaLabel = 'Delete Step 2 turn left';
        expect(deleteButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        deleteButton.simulate('click');
        expect(mockDeleteHandler.mock.calls.length).toBe(1);
    });

    test('When the replaceCurrentStep option is selected on second step turn left of the program', () => {
        const { wrapper, mockReplaceHandler } = createMountActionPanel();
        const replaceCurrentStepButton = getActionPanelOptionButtons(wrapper, 'replaceCurrentStep');
        const expectedAriaLabel = 'Replace Step 2 turn left with selected action right';
        expect(replaceCurrentStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        replaceCurrentStepButton.simulate('click');
        expect(mockReplaceHandler.mock.calls.length).toBe(1);
    })

    test('When the moveToPreviousStep option is selected on second step turn left of the program', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel();
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = 'Move Step 2 turn left before step 1 forward';
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        moveToPreviousStepButton.simulate('click');
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
    });

    test('When the moveToNextStep option is selected on second step turn left of the program', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel();
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = 'Move Step 2 turn left after step 3 turn right';
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        moveToNextStepButton.simulate('click');
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
    });
});
