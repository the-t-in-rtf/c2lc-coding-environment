// @flow

import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import type {Program} from './types';
import React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';


type ProgramBlockEditorProps = {
    program: Program,
    programVer: number,
    onChange: (Program) => void
};

export default class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, {}> {
    counter: number;
    constructor(props: ProgramBlockEditorProps) {
        super(props);
    }


    render() {
        return (
            <Container>
                    <Col>
                        {this.props.program.map((item, programStepNumber)=> {
                            switch(item) {
                                case 'forward': return <Row key={`${programStepNumber}-forward`} className='justify-content-center'><Button><Image src={arrowUp} /></Button></Row>;
                                case 'left': return <Row key={`${programStepNumber}-left`} className='justify-content-center'><Button><Image src={arrowLeft} /></Button></Row>;
                                case 'right': return <Row key={`${programStepNumber}-right`} className='justify-content-center'><Button><Image src={arrowRight} /></Button></Row>;
                                default: return;
                            }
                        })}
                    </Col>
            </Container>
        );
    }
}
