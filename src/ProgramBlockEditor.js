// @flow

import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import * as ProgramUtils from './ProgramUtils';
import type {Program} from './types';
import React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import addIcon from 'material-design-icons/content/svg/production/ic_add_24px.svg';
import deleteIcon from 'material-design-icons/content/svg/production/ic_clear_24px.svg';
import emptyBlockIcon from 'material-design-icons/toggle/svg/production/ic_check_box_outline_blank_48px.svg';

type ProgramBlockEditorProps = {
    program: Program,
    selectedCommand: string,
    onChange: (Program) => void
};

type ProgramBlockEditorState = {
    addBlockActive: boolean,
    deleteBlockActive: boolean
}

export default class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    counter: number;
    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.state = {
            addBlockActive: false,
            deleteBlockActive: false
        }
    }

    handleClickAdd = () => {
        this.setState((state) => {
            return {
                addBlockActive: !this.state.addBlockActive,
                deleteBlockActive: false
            }
        });
    };

    handleClickDelete = () => {
        this.setState((state) => {
            return {
                addBlockActive: false,
                deleteBlockActive: !this.state.deleteBlockActive
            }
        });
    };

    handleClickStep = (index: number) => {
        if (this.state.addBlockActive) {
            this.props.onChange(ProgramUtils.insert(this.props.program,
                index, 'none', 'none'));
        } else if (this.state.deleteBlockActive) {
            this.props.onChange(ProgramUtils.deleteStep(this.props.program, index));
        } else if (!this.state.addBlockActive && !this.state.deleteBlockActive) {
            this.props.onChange(ProgramUtils.overwrite(this.props.program,
                index, this.props.selectedCommand, 'none'));
        }
    };

    render() {
        return (
            <Container>
                <Row className='justify-content-end'>
                    <Col>
                        <Button
                            key='addButton'
                            aria-label={this.state.addBlockActive ? 'deactivate add a program to the sequence mode' : 'activate add a program to the sequence mode'}
                            variant={this.state.addBlockActive ? 'outline-primary' : 'light'}
                            onClick={this.handleClickAdd}>
                            <Image src={addIcon} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            key='deleteButton'
                            aria-label={this.state.deleteBlockActive ? 'deactivate delete a program from the sequence mode' : 'activate delete a program from the sequence mode'}
                            variant={this.state.deleteBlockActive ? 'outline-primary' : 'light'}
                            onClick={this.handleClickDelete}>
                            <Image src={deleteIcon} />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.props.program.map((item, programStepNumber)=> {
                            switch(item) {
                                case 'forward': return (
                                    <Row
                                        key={`${programStepNumber}-forward`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.state.addBlockActive ? `Forward button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Forward button. Press to delete this command` : 'Forward button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowUp} />
                                        </Button>
                                    </Row>);
                                case 'left': return (
                                    <Row
                                        key={`${programStepNumber}-left`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.state.addBlockActive ? `Left button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Left button. Press to delete this command` : 'Left button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowLeft} />
                                        </Button>
                                    </Row>);
                                case 'right': return (
                                    <Row
                                        key={`${programStepNumber}-right`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.state.addBlockActive ? `Right button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Right button. Press to delete this command` : 'Right button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowRight} />
                                        </Button>
                                    </Row>);
                                case 'none': return (
                                    <Row
                                        key={`${programStepNumber}-none`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.state.addBlockActive ? `Empty blcok button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Empty block button. Press to delete this command` : 'Empty block button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={emptyBlockIcon} />
                                        </Button>
                                    </Row>);
                                default: return;
                            }
                        })}
                    </Col>
                </Row>
            </Container>
        );
    }
}
