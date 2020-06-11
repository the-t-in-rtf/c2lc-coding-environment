// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import App from './App';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import FocusTrapManager from './FocusTrapManager';
import messages from './messages.json';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import ProgramBlockEditor from './ProgramBlockEditor';

configure({ adapter: new Adapter()});

// TODO: Mock the FocusTrapManager

const defaultProgramBlockEditorProps = {
    program: ['forward', 'left', 'forward', 'left'],
    interpreterIsRunning: false,
    activeProgramStepNum: null,
    selectedAction: null,
    editingDisabled: false,
    replaceIsActive: false,
    runButtonDisabled: false,
    deleteModeDescriptionId: 'someDeleteModeDescriptionId',
    focusTrapManager: new FocusTrapManager()
};

function createShallowProgramBlockEditor(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockClickRunButtonHandler = jest.fn();
    const mockChangeHandler = jest.fn();
    const mockSetReplaceHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            ProgramBlockEditor.WrappedComponent,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    intl: intl,
                    onClickRunButton: mockClickRunButtonHandler,
                    onChange: mockChangeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockClickRunButtonHandler,
        mockChangeHandler
    };
}

function createMountProgramBlockEditor(props) {
    const mockClickRunButtonHandler = jest.fn();
    const mockChangeHandler = jest.fn();
    const mockSetReplaceHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    onClickRunButton: mockClickRunButtonHandler,
                    onChange: mockChangeHandler
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
        mockClickRunButtonHandler,
        mockChangeHandler
    };
}

function getProgramResetButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-reset-button');
}

function getProgramBlockWithActionPanel(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('div')
        .filter('.ProgramBlockEditor__program-block-with-panel');
}

function getActionPanelActionButtons(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ActionPanel__action-buttons');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index);
}

function getRunButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__run-button');
}

describe('Render Action Panel', () => {
    test.each([
        [0, true],
        [1, true],
        [2, true],
        [3, true],
        [4, false]
    ])('When a step is clicked, action panel should render next to the step',
        (stepNum, actionPanelIsRendered) => {
            const { wrapper } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            expect(actionPanelContainer.contains(ActionPanel)).toBe(actionPanelIsRendered);
        }
    );
});

describe('Delete All button', () => {
    test('When the Delete All button is clicked, then the dialog shoud be shown', () => {
        expect.assertions(2);

        const { wrapper } = createShallowProgramBlockEditor();

        // Initially, check that the modal is not showing
        expect(wrapper.state().showConfirmDeleteAll).toBe(false);
        // When the Delete All button is clicked
        const deleteAllButton = getProgramResetButton(wrapper).at(0);
        deleteAllButton.simulate('click');
        // Then the dialog should be shown
        expect(wrapper.state().showConfirmDeleteAll).toBe(true);
    });
});

describe('Delete program steps', () => {
    test.each([
        [ 0, ['left', 'forward', 'left']],
        [ 3, ['forward', 'left', 'forward']]
    ])('While the action panel is open, when block %i is clicked, then program should be updated',
        (stepNum, expectedProgram) => {
            const { wrapper, mockChangeHandler } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);

            // ActionPanel should be rendered on click of a program block
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const deleteStepButton = getActionPanelActionButtons(wrapper).at(0);
            deleteStepButton.simulate('click');
            // The program should be updated
            expect(mockChangeHandler.mock.calls.length).toBe(1);
            expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);

            // And focus should remain on the clicked block
            expect(document.activeElement).toBe(getProgramBlockAtPosition(wrapper, stepNum).getDOMNode());
        }
    );
});

describe('Replace program steps', () => {
    test.each([
        [ 0, ['right', 'left', 'forward', 'left'], 'right'],
        [ 0, ['forward', 'left', 'forward', 'left'], null]
    ]) ('Replace a program if selectedAction is not null',
        (stepNum, expectedProgram, selectedAction) => {
            expect.assertions(3);
            const { wrapper, mockChangeHandler } = createMountProgramBlockEditor({
                selectedAction
            });
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);

            // ActionPanel should be rendered on click of a program block
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const replaceButton = getActionPanelActionButtons(wrapper).at(1);
            replaceButton.simulate('click');

            // The program should be updated
            if (selectedAction) {
                expect(mockChangeHandler.mock.calls.length).toBe(1);
                expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                expect(mockChangeHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    );
});

describe('Move up a program steps from a program sequence', () => {
    test.each([
        [ 0, ['forward', 'left', 'forward', 'left']],
        [ 2, ['forward', 'forward', 'left', 'left']]
    ]) ('Changes position with a step above, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, mockChangeHandler } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);

            // ActionPanel should be rendered on click of a program block
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const moveUpAStepButton = getActionPanelActionButtons(wrapper).at(2);
            moveUpAStepButton.simulate('click');

            // The program should be updated
            if (stepNum > 0) {
                expect(mockChangeHandler.mock.calls.length).toBe(1);
                expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                expect(mockChangeHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Program rendering', () => {
    test('Blocks should be rendered for the test program, with a none block at the end', () => {
        expect.assertions(6);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getProgramBlocks(wrapper).length).toBe(5);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('left');
        expect(getProgramBlocks(wrapper).at(2).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(3).prop('data-command')).toBe('left');
        expect(getProgramBlocks(wrapper).at(4).prop('data-command')).toBe('none');
    });
});

describe('Move down a program steps from a program sequence', () => {
    test.each([
        [ 0, ['left', 'forward', 'forward', 'left']],
        [ 3, ['forward', 'left', 'forward', 'left']]
    ]) ('Changes position with a step below, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, mockChangeHandler } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);

            // ActionPanel should be rendered on click of a program block
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const moveUpAStepButton = getActionPanelActionButtons(wrapper).at(3);
            moveUpAStepButton.simulate('click');

            // The program should be updated
            if (stepNum < wrapper.props().program.length-1) {
                expect(mockChangeHandler.mock.calls.length).toBe(1);
                expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                expect(mockChangeHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Delete All button can be disabled', () => {
    describe('Given editing is enabled', () => {
        test('Then the buttons should not be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: false
            });
            expect(getProgramResetButton(wrapper).get(0).props.disabled).toBe(false);
        });
    });

    describe('Given editing is disabled', () => {
        test('Then the buttons should be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: true
            });
            expect(getProgramResetButton(wrapper).get(0).props.disabled).toBe(true);
        });
    });
});

describe('Scroll to show the active program step', () => {
    test.each([
        1,
        2
    ])('When active program step number is set to %i, then the editor should scroll to the step',
        (stepNum) => {
            expect.assertions(4);

            const mockScrollIntoView = jest.fn();

            window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

            const { wrapper } = createMountProgramBlockEditor();

            wrapper.setProps({
                activeProgramStepNum: stepNum
            });

            expect(mockScrollIntoView.mock.calls.length).toBe(1);
            expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });

            expect(mockScrollIntoView.mock.instances.length).toBe(1);
            expect(mockScrollIntoView.mock.instances[0]).toBe(getProgramBlockAtPosition(wrapper, stepNum).getDOMNode());
        }
    );
});

describe('The Run button class is changed when the program is running', () => {
    describe('Given the program is running', () => {
        test('Then the Run button should have the pressed class', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                interpreterIsRunning: true
            });
            expect(getRunButton(wrapper).hasClass('ProgramBlockEditor__run-button--pressed')).toBe(true);
        })
    });

    describe('Given the program is not running', () => {
        test('Then the Run button should not have the pressed class', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                interpreterIsRunning: false
            });
            expect(getRunButton(wrapper).hasClass('ProgramBlockEditor__run-button--pressed')).toBe(false);
        })
    });
});

describe('The Run button can be disabled', () => {
    describe('Given runButtonDisabled is true', () => {
        test('Then the Run button should be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                runButtonDisabled: true
            });
            expect(getRunButton(wrapper).props().disabled).toBe(true);
        })
    });

    describe('Given runButtonDisabled is false', () => {
        test('Then the Run button should not be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                runButtonDisabled: false
            });
            expect(getRunButton(wrapper).props().disabled).toBe(false);
        })
    });
});

test('The editor scrolls when a step is added to the end of the program', () => {
    expect.assertions(6);

    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Given a program of 5 forwards and 'forward' as the selected command
    const { wrapper, mockChangeHandler } = createMountProgramBlockEditor({
        program: ['forward', 'forward', 'forward', 'forward', 'forward'],
        selectedAction: 'forward'
    });

    // When the empty block at the end of the program is replaced by 'forward'
    const emptyBlock = wrapper.find({'data-stepnumber': 5}).at(0);
    emptyBlock.simulate('click');

    // Then the program should be changed
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(
        ['forward', 'forward', 'forward', 'forward', 'forward', 'forward']);

    // And updating the program triggers auto scroll
    wrapper.setProps({ program: mockChangeHandler.mock.calls[0][0] });
    expect(mockScrollIntoView.mock.calls.length).toBe(1);
    expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });
    expect(mockScrollIntoView.mock.instances.length).toBe(1);
    expect(mockScrollIntoView.mock.instances[0]).toBe(getProgramBlockAtPosition(wrapper, 6).getDOMNode());
});
