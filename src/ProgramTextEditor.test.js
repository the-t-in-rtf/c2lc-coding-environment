import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import ProgramTextEditor from './ProgramTextEditor';
import TextSyntax from './TextSyntax';

configure({ adapter: new Adapter()});

test('number of tabs rendered by CommandPalette component should be equal to number of categories', () => {
    const mockFn = jest.fn();
    const programTextEditorWrapper = shallow(
        <ProgramTextEditor 
            program={['forward', 'left', 'forward']} 
            programVer={1}
            syntax={new TextSyntax()}
            onChange={mockFn}/>);
    const getTextEditor = () => (programTextEditorWrapper.find('#texteditor-0'));

    // value of program text area should reflect current state for program    
    expect(getTextEditor().props().value).toBe(programTextEditorWrapper.instance().props.program.join(' '));

    // text state should change according to the value of the text field 
    const textChangeEvent = {currentTarget: { value: 'forward left forward left' }};
    getTextEditor().simulate('change', textChangeEvent);
    programTextEditorWrapper.update();
    expect(getTextEditor().props().value).toBe(programTextEditorWrapper.instance().state.text);
});