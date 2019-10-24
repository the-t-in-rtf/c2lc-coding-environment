// @flow

import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import type {Program} from './types';
import * as React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';


type ProgramBlockEditorProps = {
    program: Program,
    programVer: number,
    onChange: (Program) => void
};

type ProgramBlockEditorState = {
    programVer: number,
    program: Array<string>
};

export default class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.state = {
            programVer: props.programVer,
            program: props.program
        }
    }


    render() {
        return (
            <Container>
                    <Col>
                        {this.state.program.map(item => {
                            switch(item) {
                                case 'forward': return <Row className='justify-content-center'><Button><Image src={arrowUp} /></Button></Row>;
                                case 'left': return <Row className='justify-content-center'><Button><Image src={arrowLeft} /></Button></Row>;
                                case 'right': return <Row className='justify-content-center'><Button><Image src={arrowRight} /></Button></Row>;
                            }
                        })}
                    </Col>
            </Container>
        );
    }
}
