// @flow

import ProgramBlockEditor from './ProgramBlockEditor';
import ProgramTextEditor from './ProgramTextEditor';
import React from 'react';
import TextSyntax from './TextSyntax';
import { Container } from 'react-bootstrap';
import type {Program} from './types';


type EditorContainerProps = {
    program: Program,
    programVer: number,
    syntax: TextSyntax,
    onChange: (Program) => void,
    addEmptyProgramBlock: (number) => void,
    deleteProgramBlock: (number) => void,
    changeProgramBlock: (number, string) => void,
    mode: string,
    selectedCommand: string
};

export default class EditorContainer extends React.Component<EditorContainerProps, {}> {

    constructor(props: EditorContainerProps) {
        super(props);
    }

    render() {
        return (
            <Container>
                {this.props.mode === 'text' ? (
                    <ProgramTextEditor 
                        program={this.props.program}
                        programVer={this.props.programVer}
                        syntax={this.props.syntax}
                        onChange={this.props.onChange} /> 
                 ) : (
                     //ProgramBlockEditor doesn't have TextSyntax
                    <ProgramBlockEditor
                        program={this.props.program}
                        programVer={this.props.programVer}
                        onChange={this.props.onChange} 
                        addEmptyProgramBlock={this.props.addEmptyProgramBlock}
                        deleteProgramBlock={this.props.deleteProgramBlock}
                        changeProgramBlock={this.props.changeProgramBlock}
                        selectedCommand={this.props.selectedCommand}
                        /> 
                )}
            </Container>
        );
    }
}