// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl } from 'react-intl';
import App from './App';
import messages from './messages.json';
import ProgramBlockEditor from './ProgramBlockEditor';

configure({ adapter: new Adapter()});

test('onSelect property of ProgramBlockEditor component should change action buttons variants and aria-pressed according to selectedAction property', () => {
    const mockSelectHandler = jest.fn();
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const programBlockEditorWrapper = shallow(
        <ProgramBlockEditor.WrappedComponent
            intl={intl}
            program={['forward', 'left', 'forward', 'left']}
            selectedAction={null}
            onSelectAction={mockSelectHandler} />
    );

    const getEditorActionButtons = () => (programBlockEditorWrapper.find('.ProgramBlockEditor__editor-action-button'));
    // check if two buttons for editor action add and delete are rendered
    expect(getEditorActionButtons().length).toBe(2);
    expect(getEditorActionButtons().get(0).key).toBe('addButton');
    expect(getEditorActionButtons().get(1).key).toBe('deleteButton');

    // aira-pressed should be false, and variant should be light before a click event
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(0).props.variant).toBe('light');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(1).props.variant).toBe('light');

    const addButton = programBlockEditorWrapper.find('.ProgramBlockEditor__editor-action-button').at(0);
    const deleteButton = programBlockEditorWrapper.find('.ProgramBlockEditor__editor-action-button').at(1);

    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(1);
    expect(mockSelectHandler.mock.calls[0][0]).toStrictEqual({'action': 'add', 'type': 'editorAction'});
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[0][0]});

    // addButton -- aria-pressed should be true and variant should be outline-primary with a click event for a selected action, and the other action remains its state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('true');
    expect(getEditorActionButtons().get(0).props.variant).toBe('outline-primary');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(1).props.variant).toBe('light');

    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(2);
    expect(mockSelectHandler.mock.calls[1][0]).toBeNull();
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[1][0]});

    // addButton -- when same action button is clicked, aria-pressed and variant of the action should reset to initial state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(0).props.variant).toBe('light');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(1).props.variant).toBe('light');

    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(3);
    expect(mockSelectHandler.mock.calls[2][0]).toStrictEqual({'action': 'add', 'type': 'editorAction'});
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[2][0]});
    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(4);
    expect(mockSelectHandler.mock.calls[3][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[3][0]});

    /* addButton -- when an action is selected and different action button is clicked, aria-pressed and variant of previous action before the click should reset to initial state
       and newly selected action's aria-pressed and variant should change to be true and outline-primary
    */
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(0).props.variant).toBe('light');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('true');
    expect(getEditorActionButtons().get(1).props.variant).toBe('outline-primary');

    programBlockEditorWrapper.setProps({selectedAction : null});

    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(5);
    expect(mockSelectHandler.mock.calls[4][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[4][0]});

    // deleteButton -- aria-pressed should be true and variant should be outline-primary with a click event for a selected action, and the other action remains its state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(0).props.variant).toBe('light');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('true');
    expect(getEditorActionButtons().get(1).props.variant).toBe('outline-primary');

    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(6);
    expect(mockSelectHandler.mock.calls[5][0]).toBeNull();
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[5][0]});

    // deleteButton -- when same action button is clicked, aria-pressed and variant of the action should reset to initial state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(0).props.variant).toBe('light');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(1).props.variant).toBe('light');

    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(7);
    expect(mockSelectHandler.mock.calls[6][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[6][0]});
    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(8);
    expect(mockSelectHandler.mock.calls[7][0]).toStrictEqual({'action': 'add', 'type': 'editorAction'});
    programBlockEditorWrapper.setProps({selectedAction : mockSelectHandler.mock.calls[7][0]});

    /* addButton -- when an action is selected and different action button is clicked, aria-pressed and variant of previous action before the click should reset to initial state
       and newly selected action's aria-pressed and variant should change to be true and outline-primary
    */
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('true');
    expect(getEditorActionButtons().get(0).props.variant).toBe('outline-primary');
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(getEditorActionButtons().get(1).props.variant).toBe('light');
});

test('blocks', () => {
    const mockChangeHandler = jest.fn();
    const mockSelectHandler = jest.fn();
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const programBlockEditorWrapper = shallow(
        <ProgramBlockEditor.WrappedComponent
            intl={intl}
            program={['forward', 'left', 'forward', 'left']}
            selectedAction={null}
            onSelectAction={mockSelectHandler}
            onChange={mockChangeHandler} />
    );

    const getProgramBlocks = () => (programBlockEditorWrapper.find(Button).not('.ProgramBlockEditor__editor-action-button'));
    // number of program blocks getting rendered should be equal to number of commands in the program with its command names
    expect(getProgramBlocks().length).toBe(4);
    expect(getProgramBlocks().get(0).key.includes('forward')).toBe(true);
    expect(getProgramBlocks().get(1).key.includes('left')).toBe(true);
    expect(getProgramBlocks().get(2).key.includes('forward')).toBe(true);
    expect(getProgramBlocks().get(3).key.includes('left')).toBe(true);

    programBlockEditorWrapper.setProps({selectedAction: {'action': 'add', 'type': 'editorAction'}});
    const getProgramBlockAtPosition = (index: number) => (getProgramBlocks().at(index));
    // when selected Action is add, when you press any program blocks, an empty block (none command) will be added to the previous index and set selectedCommand to null
    getProgramBlockAtPosition(0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(['none', 'forward', 'left', 'forward', 'left']);
    expect(mockSelectHandler.mock.calls.length).toBe(1);
    expect(mockSelectHandler.mock.calls[0][0]).toBeNull();

    programBlockEditorWrapper.setProps({program : mockChangeHandler.mock.calls[0][0]});
    programBlockEditorWrapper.setProps({selectedAction: {'commandName' : 'right', 'type': 'command'}});
    // when selected Action is a command, change existing command at a clicked block to be selected command and set selected action back to null
    getProgramBlockAtPosition(0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toStrictEqual(['right', 'forward', 'left', 'forward', 'left']);
    expect(mockSelectHandler.mock.calls.length).toBe(2);
    expect(mockSelectHandler.mock.calls[1][0]).toBeNull();

    programBlockEditorWrapper.setProps({program : mockChangeHandler.mock.calls[1][0]});
    programBlockEditorWrapper.setProps({selectedAction: {'action' : 'delete', 'type': 'editorAction'}});
    // when selected Action is delete, when you press any program blocks, the block and its command will be removed from the program
    getProgramBlockAtPosition(0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(3);
    expect(mockChangeHandler.mock.calls[2][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
    expect(mockSelectHandler.mock.calls.length).toBe(3);
    expect(mockSelectHandler.mock.calls[2][0]).toBeNull();

    // repeat the test cases for the last command in the program

    programBlockEditorWrapper.setProps({program : mockChangeHandler.mock.calls[2][0]});
    programBlockEditorWrapper.setProps({selectedAction: {'action': 'add', 'type': 'editorAction'}});
    // when selected Action is add, when you press any program blocks, an empty block (none command) will be added to the previous index and set selectedCommand to null
    getProgramBlockAtPosition(3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(4);
    expect(mockChangeHandler.mock.calls[3][0]).toStrictEqual(['forward', 'left', 'forward', 'none', 'left']);
    expect(mockSelectHandler.mock.calls.length).toBe(4);
    expect(mockSelectHandler.mock.calls[3][0]).toBeNull();

    programBlockEditorWrapper.setProps({program : mockChangeHandler.mock.calls[3][0]});
    programBlockEditorWrapper.setProps({selectedAction: {'commandName' : 'right', 'type': 'command'}});
    // when selected Action is a command, change existing command at a clicked block to be selected command and set selected action back to null
    getProgramBlockAtPosition(3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(5);
    expect(mockChangeHandler.mock.calls[4][0]).toStrictEqual(['forward', 'left', 'forward', 'right', 'left']);
    expect(mockSelectHandler.mock.calls.length).toBe(5);
    expect(mockSelectHandler.mock.calls[4][0]).toBeNull();

    programBlockEditorWrapper.setProps({program : mockChangeHandler.mock.calls[4][0]});
    programBlockEditorWrapper.setProps({selectedAction: {'action' : 'delete', 'type': 'editorAction'}});
    // when selected Action is delete, when you press any program blocks, the block and its command will be removed from the program
    getProgramBlockAtPosition(3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(6);
    expect(mockChangeHandler.mock.calls[5][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
    expect(mockSelectHandler.mock.calls.length).toBe(6);
    expect(mockSelectHandler.mock.calls[5][0]).toBeNull();
})
