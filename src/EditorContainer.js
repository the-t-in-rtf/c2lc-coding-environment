// @flow

import ProgramBlockEditor from './ProgramBlockEditor';
import ProgramTextEditor from './ProgramTextEditor';
import React from 'react';
import TextSyntax from './TextSyntax';
import { Container } from 'react-bootstrap';
import type {EditorMode, Program} from './types';


type EditorContainerProps = {
    program: Program,
    syntax: TextSyntax,
    onChange: (Program) => void,
    addEmptyProgramBlock: (number) => void,
    deleteProgramBlock: (number) => void,
    changeProgramBlock: (number, string) => void,
    mode: EditorMode,
    selectedCommand: string
};

export default class EditorContainer extends React.Component<EditorContainerProps, {}> {
    render() {
        return (
            <Container>
                {this.props.mode === 'text' ? (
                    <ProgramTextEditor
                        program={this.props.program}
                        syntax={this.props.syntax}
                        onChange={this.props.onChange} />
                ) : (
                    <ProgramBlockEditor
                        program={this.props.program}
                        selectedCommand={this.props.selectedCommand}
                        onChange={this.props.onChange}
                        // move to ProgramBlockEditor
                        addEmptyProgramBlock={this.props.addEmptyProgramBlock}
                        deleteProgramBlock={this.props.deleteProgramBlock}
                        changeProgramBlock={this.props.changeProgramBlock}
                    />
                )}
            </Container>
        );
    }
}
