import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import EditorContainer from './EditorContainer';
import ProgramBlockEditor from './ProgramBlockEditor';
import ProgramTextEditor from './ProgramTextEditor';


configure({ adapter: new Adapter()});

test('check if ProgramTextEditor component is rendering when EditorContainer has mode of text', () => {
    const wrapper = shallow(<EditorContainer mode='text' />);
    expect(wrapper.find(ProgramTextEditor)).toHaveLength(1);
});

test('check if ProgramBlockEditor component is rendering when EditorContainer has mode of block', () => {
    const wrapper = shallow(<EditorContainer mode='block' />);
    const BlockEditor = wrapper.find(ProgramBlockEditor);
    expect(BlockEditor).toHaveLength(1);
})


