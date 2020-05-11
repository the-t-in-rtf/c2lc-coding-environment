// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import App from './App';
import AriaDisablingButton from './AriaDisablingButton';
import messages from './messages.json';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import ProgramBlockEditor from './ProgramBlockEditor';

configure({ adapter: new Adapter()});

const defaultProgramBlockEditorProps = {
    program: ['forward', 'left', 'forward', 'left'],
    interpreterIsRunning: false,
    activeProgramStepNum: null,
    selectedAction: null,
    editingDisabled: false,
    runButtonDisabled: false,
    addModeDescriptionId: 'someAddModeDescriptionId',
    deleteModeDescriptionId: 'someDeleteModeDescriptionId'
};

const addAction = {
    type: 'editorAction',
    action: 'add'
};

const deleteAction = {
    type: 'editorAction',
    action: 'delete'
}

const rightCommandAction = {
    type: 'command',
    commandName: 'right'
}

function createShallowProgramBlockEditor(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockClickRunButtonHandler = jest.fn();
    const mockSelectActionHandler = jest.fn();
    const mockChangeHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            ProgramBlockEditor.WrappedComponent,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    intl: intl,
                    onClickRunButton: mockClickRunButtonHandler,
                    onSelectAction: mockSelectActionHandler,
                    onChange: mockChangeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockClickRunButtonHandler,
        mockSelectActionHandler,
        mockChangeHandler
    };
}

function createMountProgramBlockEditor(props) {
    const mockClickRunButtonHandler = jest.fn();
    const mockSelectActionHandler = jest.fn();
    const mockChangeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    onClickRunButton: mockClickRunButtonHandler,
                    onSelectAction: mockSelectActionHandler,
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
        mockSelectActionHandler,
        mockChangeHandler
    };
}

function getEditorActionButtons(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__editor-action-button');
}

function hasPressedClass(button) {
    return button.hasClass('ProgramBlockEditor__editor-action-button--pressed');
}

function getDeleteAllButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__delete-all-button');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index)
}

function getRunButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__run-button');
}

function getAddNodeButtonAtPosition(programBlockEditorWrapper, index: number) {
    const addNodeButton = programBlockEditorWrapper.find({'data-stepnumber': index});
    return addNodeButton.at(0);
}

describe('Editor buttons', () => {
    describe('Given no selected action', () => {
        let wrapper, mockSelectActionHandler;

        beforeEach(() => {
            ({ wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor({
                selectedAction: null
            }));
        });

        test('Then no editor buttons should have presssed state', () => {
            expect.assertions(4);

            expect(getEditorActionButtons(wrapper).length).toBe(1);

            expect(getEditorActionButtons(wrapper).get(0).key).toBe('deleteButton');
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(false);
        });

        test('When Delete is clicked, then selected action should be set to Delete', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                'type': 'editorAction',
                'action': 'delete'
            });
        });
    });

    describe('Given selected action is Delete', () => {
        let wrapper, mockSelectActionHandler;

        beforeEach(() => {
            ({ wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor({
                selectedAction: deleteAction
            }));
        });

        test('Then the Delete button should have pressed state', () => {
            expect.assertions(2);
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('true');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(true);
        });

        test('When Delete is clicked, then it should be toggled off', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toBeNull();
        });
    });
});

describe('Editor buttons aria-describedby', () => {
    test('Should be set to the provided ids', () => {
        expect.assertions(1);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getEditorActionButtons(wrapper).get(0).props['aria-describedby']).toBe('someDeleteModeDescriptionId');
    });
});

describe('Delete All button', () => {
    describe('Given selected action is Delete', () => {
        test('When the Delete All button is clicked, then the dialog should be shown', () => {
            expect.assertions(2);

            const { wrapper } = createShallowProgramBlockEditor({
                    selectedAction: deleteAction
            });

            // Initially, check that the modal is not showing
            expect(wrapper.state().showConfirmDeleteAll).toBe(false);
            // When the Delete All button is clicked
            const deleteAllButton = getDeleteAllButton(wrapper).at(0);
            deleteAllButton.simulate('click');
            // Then the dialog should be shown
            expect(wrapper.state().showConfirmDeleteAll).toBe(true);
        });
    });
});

describe('Program rendering', () => {
    test('Blocks should be rendered for the test program, with a none block at the end', () => {
        expect.assertions(5);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getProgramBlocks(wrapper).length).toBe(4);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('left');
        expect(getProgramBlocks(wrapper).at(2).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(3).prop('data-command')).toBe('left');
    });
});

describe('Delete program steps', () => {
    test.each([
        ['Delete', 0, ['left', 'forward', 'left'], deleteAction],
        ['Delete', 2, ['forward', 'left', 'left'], deleteAction]
    ])('Given selected action is %s, when block %i is clicked, then program should be updated',
        (actionName, stepNum, expectedProgram, action) => {

            expect.assertions(4);

            const { wrapper, mockSelectActionHandler, mockChangeHandler } =
                createMountProgramBlockEditor({
                    selectedAction: action
                });

            getProgramBlockAtPosition(wrapper, stepNum).simulate('click');

            // The program should be updated
            expect(mockChangeHandler.mock.calls.length).toBe(1);
            expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            wrapper.setProps({program: expectedProgram});

            // And focus should remain on the clicked block
            expect(document.activeElement).toBe(getProgramBlockAtPosition(wrapper, stepNum).getDOMNode());

            // And the selected action should not have changed
            expect(mockSelectActionHandler.mock.calls.length).toBe(0);
        }
    );
});

describe('Editing can be disabled', () => {
    describe('Given editing is enabled', () => {
        test('Then the buttons should not be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: false
            });
            expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(false);
        });
    });

    describe('Given editing is disabled', () => {
        test('Then the buttons should be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: true
            });
            expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(true);
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
    //expect.assertions(6);

    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Given a program of 5 forwards and 'forward' as the selected command
    const { wrapper, mockChangeHandler } = createMountProgramBlockEditor({
        program: ['forward', 'forward', 'forward', 'forward', 'forward'],
        selectedAction: {
            'commandName': 'forward',
            'type': 'command'
        }
    });

    // When the empty block at the end of the program is replaced by 'forward'
    const addNode = getAddNodeButtonAtPosition(wrapper, 5);
    addNode.simulate('click');

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
    expect(mockScrollIntoView.mock.instances[0]).toBe(getAddNodeButtonAtPosition(wrapper, 6).getDOMNode());
});
