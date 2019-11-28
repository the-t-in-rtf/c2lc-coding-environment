// @flow

import React from 'react';
import {FormattedMessage} from 'react-intl';
import TextSyntax from './TextSyntax';
import * as Utils from './Utils';
import type {Program} from './types';

type ProgramTextEditorProps = {
    program: Program,
    syntax: TextSyntax,
    onChange: (Program) => void
};

type ProgramTextEditorState = {
    programPropAsText: string,
    text: string
};

export default class ProgramTextEditor extends React.Component<ProgramTextEditorProps, ProgramTextEditorState> {
    // This is a 'uncontrolled component' that maintains its own local version
    // of the program text. The changes are sent outwards (to the
    // props.onChange handler) at blur. And getDerivedStateFromProps() is used
    // with an explicit version number to trigger this component to update
    // its state to reflect changes from outside.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html

    textareaId: string;

    constructor(props: ProgramTextEditorProps) {
        super(props);
        this.textareaId = Utils.generateId('texteditor');
        const programText = props.syntax.print(props.program);
        this.state = {
            programPropAsText: programText,
            text: programText
        };
    }

    static getDerivedStateFromProps(props: ProgramTextEditorProps, state: ProgramTextEditorState) {
        // Update this component's text if the program prop has been changed
        if (props.syntax.print(props.program) !== state.programPropAsText) {
            const programText = props.syntax.print(props.program);
            return {
                programPropAsText: programText,
                text: programText
            };
        } else {
            return null;
        }
    }

    handleChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
        // Update the local program text state
        this.setState({
            text: e.currentTarget.value
        });
    };

    handleBlur = () => {
        // Call the props.onChange handler at blur.
        // We could implement a much more sophisticated strategy here, such as
        // checking if the program is valid at each edit (textarea.onChange)
        // and call the onChange handler if the program has changed (and it is
        // valid).
        this.props.onChange(this.props.syntax.read(this.state.text));
    };

    render() {
        return (
            <div>
                <label htmlFor={this.textareaId}>
                    <FormattedMessage id='ProgramTextEditor.programLabel' />
                </label>
                <textarea
                    id={this.textareaId}
                    value={this.state.text}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur} />
            </div>
        );
    }

}
