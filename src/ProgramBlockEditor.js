// @flow

import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedAction} from './types';
import React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import addIcon from 'material-design-icons/content/svg/production/ic_add_24px.svg';
import deleteIcon from 'material-design-icons/content/svg/production/ic_clear_24px.svg';
import emptyBlockIcon from 'material-design-icons/toggle/svg/production/ic_check_box_outline_blank_48px.svg';

type ProgramBlockEditorProps = {
    program: Program,
    selectedAction: SelectedAction,
    onSelectAction: (selectedAction: SelectedAction) => void,
    onChange: (Program) => void
};

export default class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, {}> {
    toggleAction(action: 'add' | 'delete') {
        if (this.props.selectedAction
                && this.props.selectedAction.type === 'editorAction'
                && this.props.selectedAction.action === action) {
            this.props.onSelectAction(null);
        } else {
            this.props.onSelectAction({
                type: 'editorAction',
                action: action
            });
        }
    };

    actionIsSelected(action: string) {
        return (this.props.selectedAction
            && this.props.selectedAction.type === 'editorAction'
            && this.props.selectedAction.action === action);
    }

    addIsSelected() {
        return this.actionIsSelected('add');
    }

    deleteIsSelected() {
        return this.actionIsSelected('delete');
    }

    handleClickAdd = () => {
        this.toggleAction('add');
    };

    handleClickDelete = () => {
        this.toggleAction('delete');
    };

    handleClickStep = (index: number) => {
        if (this.props.selectedAction && this.props.selectedAction.type === 'editorAction') {
            if (this.props.selectedAction.action === 'add') {
                this.props.onChange(ProgramUtils.insert(this.props.program,
                    index, 'none', 'none'));
                this.props.onSelectAction(null);
            } else if (this.props.selectedAction.action === 'delete') {
                this.props.onChange(ProgramUtils.deleteStep(this.props.program, index));
                this.props.onSelectAction(null);
            }
        } else if (this.props.selectedAction && this.props.selectedAction.type === 'command'){
            this.props.onChange(ProgramUtils.overwrite(this.props.program,
                    index, this.props.selectedAction.commandName, 'none'));
            this.props.onSelectAction(null);
        }
    };

    render() {
        return (
            <Container>
                <Row className='justify-content-end'>
                    <Col>
                        <Button
                            key='addButton'
                            aria-pressed={this.addIsSelected() ? 'true' : 'false'}
                            aria-label={'add a command to the program'}
                            variant={this.addIsSelected() ? 'outline-primary' : 'light'}
                            onClick={this.handleClickAdd}>
                            <Image src={addIcon} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            key='deleteButton'
                            aria-pressed={this.deleteIsSelected() ? 'true' : 'false'}
                            aria-label={'delete a command from the program'}
                            variant={this.deleteIsSelected() ? 'outline-primary' : 'light'}
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
                                            aria-label={this.addIsSelected() ? `Forward, position ${programStepNumber+1} of current program. Press to add an empty command block before this` : this.deleteIsSelected() ? `Forward, position ${programStepNumber+1} of current program. Press to delete this command` : `Forward, position ${programStepNumber+1} of current program`}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowUp} />
                                        </Button>
                                    </Row>);
                                case 'left': return (
                                    <Row
                                        key={`${programStepNumber}-left`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.addIsSelected() ? `Left, position ${programStepNumber+1} of current program. Press to add an empty command block before this` : this.deleteIsSelected() ? `Left, position ${programStepNumber+1} of current program. Press to delete this command` : `Left, position ${programStepNumber+1} of current program`}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowLeft} />
                                        </Button>
                                    </Row>);
                                case 'right': return (
                                    <Row
                                        key={`${programStepNumber}-right`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.addIsSelected() ? `Right, position ${programStepNumber+1} of current program. Press to add an empty command block before this` : this.deleteIsSelected() ? `Right, position ${programStepNumber+1} of current program. Press to delete this command` : `Right, position ${programStepNumber+1} of current program`}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowRight} />
                                        </Button>
                                    </Row>);
                                case 'none': return (
                                    <Row
                                        key={`${programStepNumber}-none`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.addIsSelected() ? `Empty blcok, position ${programStepNumber+1} of current program. Press to add an empty command block before this` : this.deleteIsSelected() ? `Empty block, position ${programStepNumber+1} of current program. Press to delete this command` : `Empty block, position ${programStepNumber+1} of current program`}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={emptyBlockIcon} />
                                        </Button>
                                    </Row>);
                                default: return <Row key={`${programStepNumber}-unknown`}/>;
                            }
                        })}
                    </Col>
                </Row>
            </Container>
        );
    }
}
