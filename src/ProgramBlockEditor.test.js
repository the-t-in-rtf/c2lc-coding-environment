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
    minVisibleSteps: 6,
    selectedAction: null,
    editingDisabled: false,
    runButtonDisabled: false,
    addModeDescriptionId: 'someAddModeDescriptionId',
    deleteModeDescriptionId: 'someDeleteModeDescriptionId'
};

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
        mockSelectActionHandler
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
    return programBlockEditorWrapper.find(Button)
        .filter('.ProgramBlockEditor__delete-all-button');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index)
}

function getRunButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__run-button');
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
            expect(getEditorActionButtons(wrapper).length).toBe(2);

            expect(getEditorActionButtons(wrapper).get(0).key).toBe('addButton');
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(false);

            expect(getEditorActionButtons(wrapper).get(1).key).toBe('deleteButton');
            expect(getEditorActionButtons(wrapper).get(1).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(1))).toBe(false);
        });

        test('When Add is clicked, then selected action should be set to Add', () => {
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                type: 'editorAction',
                action: 'add'
            });
        });

        test('When Delete is clicked, then selected action should be set to Delete', () => {
            getEditorActionButtons(wrapper).at(1).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                'type': 'editorAction',
                'action': 'delete'
            });
        });
    });

    describe('Given selected action is Add', () => {
        let wrapper, mockSelectActionHandler;

        beforeEach(() => {
            ({ wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor({
                selectedAction: {
                    type: 'editorAction',
                    action: 'add'
                }
            }));
        });

        test('Then the Add button should have pressed state', () => {
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('true');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(true);
            expect(getEditorActionButtons(wrapper).get(1).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(1))).toBe(false);
        });

        test('When Add is clicked, then it should be toggled off', () => {
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toBeNull();
        });

        test('When Delete is clicked, then selected action should be set to Delete', () => {
            getEditorActionButtons(wrapper).at(1).simulate('click');
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
                selectedAction: {
                    type: 'editorAction',
                    action: 'delete'
                }
            }));
        });

        test('Then the Delete button should have pressed state', () => {
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(false);
            expect(getEditorActionButtons(wrapper).get(1).props['aria-pressed']).toBe('true');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(1))).toBe(true);
        });

        test('When Delete is clicked, then it should be toggled off', () => {
            getEditorActionButtons(wrapper).at(1).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toBeNull();
        });

        test('When Add is clicked, then selected action should be set to Add', () => {
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                'type': 'editorAction',
                'action': 'add'
            });
        });
    });
});

test('blocks', () => {
    const { wrapper, mockSelectActionHandler, mockChangeHandler } = createMountProgramBlockEditor();

    // number of blocks getting rendered should be equal to minVisibleSteps
    // as minVisibleSteps is greater than the number of program steps
    expect(getProgramBlocks(wrapper).length).toBe(6);
    expect(getProgramBlocks(wrapper).get(0).key.includes('forward')).toBe(true);
    expect(getProgramBlocks(wrapper).get(1).key.includes('left')).toBe(true);
    expect(getProgramBlocks(wrapper).get(2).key.includes('forward')).toBe(true);
    expect(getProgramBlocks(wrapper).get(3).key.includes('left')).toBe(true);
    expect(getProgramBlocks(wrapper).get(4).key.includes('none')).toBe(true);
    expect(getProgramBlocks(wrapper).get(5).key.includes('none')).toBe(true);

    wrapper.setProps({selectedAction: {'action': 'add', 'type': 'editorAction'}});
    // when selected Action is add, when you press any program blocks, an empty block (none command) will be added to the previous index and set selectedCommand to null
    getProgramBlockAtPosition(wrapper, 0).simulate('click');

    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(['none', 'forward', 'left', 'forward', 'left']);
    wrapper.setProps({program : mockChangeHandler.mock.calls[0][0]});

    // focus should remain on the same block where an empty block is added

    expect(document.activeElement).toBe(getProgramBlockAtPosition(wrapper, 0).getDOMNode());

    // No onSelectAction calls should have been made
    expect(mockSelectActionHandler.mock.calls.length).toBe(0);

    wrapper.setProps({selectedAction: {'commandName' : 'right', 'type': 'command'}});
    // when selected Action is a command, change existing command at a clicked block to be selected command and set selected action back to null
    getProgramBlockAtPosition(wrapper, 0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toStrictEqual(['right', 'forward', 'left', 'forward', 'left']);
    wrapper.setProps({program : mockChangeHandler.mock.calls[1][0]});

    // focus should remain on the same block where a command is inserted
    expect(document.activeElement).toBe(getProgramBlockAtPosition(wrapper, 0).getDOMNode());

    // No onSelectAction calls should have been made
    expect(mockSelectActionHandler.mock.calls.length).toBe(0);

    wrapper.setProps({selectedAction: {'action' : 'delete', 'type': 'editorAction'}});
    // when selected Action is delete, when you press any program blocks, the block and its command will be removed from the program
    getProgramBlockAtPosition(wrapper, 0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(3);
    expect(mockChangeHandler.mock.calls[2][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
    wrapper.setProps({program : mockChangeHandler.mock.calls[2][0]});

    // focus should remain on the same blcok where a command is deleted
    expect(document.activeElement).toBe(getProgramBlockAtPosition(wrapper, 0).getDOMNode());

    // No onSelectAction calls should have been made
    expect(mockSelectActionHandler.mock.calls.length).toBe(0);

    // repeat the test cases for the last command in the program

    wrapper.setProps({selectedAction: {'action': 'add', 'type': 'editorAction'}});
    // when selected Action is add, when you press any program blocks, an empty block (none command) will be added to the previous index and set selectedCommand to null
    getProgramBlockAtPosition(wrapper, 3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(4);
    expect(mockChangeHandler.mock.calls[3][0]).toStrictEqual(['forward', 'left', 'forward', 'none', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectActionHandler.mock.calls.length).toBe(0);

    wrapper.setProps({program : mockChangeHandler.mock.calls[3][0]});
    wrapper.setProps({selectedAction: {'commandName' : 'right', 'type': 'command'}});
    // when selected Action is a command, change existing command at a clicked block to be selected command and set selected action back to null
    getProgramBlockAtPosition(wrapper, 3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(5);
    expect(mockChangeHandler.mock.calls[4][0]).toStrictEqual(['forward', 'left', 'forward', 'right', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectActionHandler.mock.calls.length).toBe(0);

    wrapper.setProps({program : mockChangeHandler.mock.calls[4][0]});
    wrapper.setProps({selectedAction: {'action' : 'delete', 'type': 'editorAction'}});
    // when selected Action is delete, when you press any program blocks, the block and its command will be removed from the program
    getProgramBlockAtPosition(wrapper, 3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(6);
    expect(mockChangeHandler.mock.calls[5][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectActionHandler.mock.calls.length).toBe(0);
})

test('The editor action buttons have aria-describedby set to provided ids', () => {
    const { wrapper } = createMountProgramBlockEditor();

    expect(getEditorActionButtons(wrapper).get(0).props['aria-describedby']).toBe('someAddModeDescriptionId');
    expect(getEditorActionButtons(wrapper).get(1).props['aria-describedby']).toBe('someDeleteModeDescriptionId');
});

test('Whenever active program step number updates, auto scroll to the step', () => {
    const mockScrollInto = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollInto;

    const { wrapper } = createMountProgramBlockEditor();

    wrapper.setProps({ activeProgramStepNum: 1 });
    expect(mockScrollInto.mock.calls.length).toBe(1);
    expect(mockScrollInto.mock.calls[0][0]).toStrictEqual({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    wrapper.setProps({ activeProgramStepNum: 2});

    expect(mockScrollInto.mock.calls.length).toBe(2);
    expect(mockScrollInto.mock.calls[1][0]).toStrictEqual({ behavior: 'smooth', block: 'nearest', inline: 'nearest'});

});

test('The editor action buttons disabled states are set according to the editingDisabled property', () => {

    const { wrapper } = createMountProgramBlockEditor();

    // editingDisabled is false
    expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(false);
    expect(getEditorActionButtons(wrapper).get(1).props.disabled).toBe(false);

    wrapper.setProps({editingDisabled: true});

    expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(true);
    expect(getEditorActionButtons(wrapper).get(1).props.disabled).toBe(true);
});

test('The run buttons color inverts by appending class name pressed when the program is running', () => {

    const { wrapper } = createShallowProgramBlockEditor({
        editingDisabled: true,
        interpreterIsRunning: true,
        runButtonDisabled: true
    });

    // When the interpreter is running, the run button has pressed and disabled
    expect(getRunButton(wrapper).hasClass('ProgramBlockEditor__run-button--pressed')).toBe(true);
    expect(getRunButton(wrapper).props().disabled).toBe(true);

    wrapper.setProps({
        activeProgramStepNum: null,
        editingDisabled: false,
        interpreterIsRunning: false,
        runButtonDisabled: false });

    // When the interpreter is not running, the run button doesn't have pressed and disabled
    expect(getRunButton(wrapper).hasClass('ProgramBlockEditor__run-button--pressed')).toBe(false);
    expect(getRunButton(wrapper).props().disabled).toBe(false);
});

test('Delete all button appears when delete action is toggled, which will open a confirmation modal onClick', () => {

    const { wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor();

    // initially, confirm modal for delete all is not visiable
    expect(wrapper.state().showConfirmDeleteAll).toBe(false);

    // toggle delete button
    const deleteButton = getEditorActionButtons(wrapper).at(1);
    deleteButton.simulate('click');
    expect(mockSelectActionHandler.mock.calls.length).toBe(1);
    expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});

    // click deleteAll button and see if modal showes up
    const deleteAllButton = getDeleteAllButton(wrapper).at(0);
    deleteAllButton.simulate('click');
    expect(wrapper.state().showConfirmDeleteAll).toBe(true);
});
