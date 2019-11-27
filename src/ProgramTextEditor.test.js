// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import ProgramTextEditor from './ProgramTextEditor';
import TextSyntax from './TextSyntax';

configure({ adapter: new Adapter()});

test('testing text input from ProgramTextEditor component', () => {
    const mockChangeHandler = jest.fn();
    const wrapper = shallow(
        <ProgramTextEditor
            program={['forward', 'left', 'forward']}
            programVer={1}
            syntax={new TextSyntax()}
            onChange={mockChangeHandler}/>);
    const getTextEditor = () => (wrapper.find('#texteditor-0'));

    // value of the program text area should reflect current state for the program
    expect(getTextEditor().props().value).toBe(wrapper.instance().props.program.join(' '));

    // text state should change according to the value of the text field
    const textChangeEvent = {currentTarget: { value: 'forward left forward left' }};
    getTextEditor().simulate('change', textChangeEvent);
    wrapper.update();
    expect(wrapper.instance().state.text).toBe(getTextEditor().props().value);

    // onChange function, that updates state of the program should be called on blur
    getTextEditor().simulate('blur');
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
});
