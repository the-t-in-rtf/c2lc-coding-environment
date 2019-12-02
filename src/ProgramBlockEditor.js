// @flow

import { Button, Col, Row } from 'react-bootstrap';
import {injectIntl} from 'react-intl';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedAction} from './types';
import React from 'react';
import { ReactComponent as ArrowLeft } from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import { ReactComponent as ArrowRight } from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import { ReactComponent as ArrowUp } from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import { ReactComponent as AddIcon } from 'material-design-icons/content/svg/production/ic_add_24px.svg';
import { ReactComponent as DeleteIcon } from 'material-design-icons/content/svg/production/ic_clear_24px.svg';
import { ReactComponent as EmptyBlockIcon } from 'material-design-icons/toggle/svg/production/ic_check_box_outline_blank_48px.svg';
import './ProgramBlockEditor.css';

type ProgramBlockEditorProps = {
    intl: any,
    minVisibleSteps: number,
    program: Program,
    selectedAction: SelectedAction,
    onSelectAction: (selectedAction: SelectedAction) => void,
    onChange: (Program) => void
};

class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, {}> {
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

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);

        if (this.props.selectedAction && this.props.selectedAction.type === 'editorAction') {
            if (this.props.selectedAction.action === 'add') {
                this.props.onChange(ProgramUtils.insert(this.props.program,
                    index, 'none', 'none'));
                this.props.onSelectAction(null);
            } else if (this.props.selectedAction.action === 'delete') {
                this.props.onChange(ProgramUtils.trimEnd(
                    ProgramUtils.deleteStep(this.props.program, index),
                    'none'));
                this.props.onSelectAction(null);
            }
        } else if (this.props.selectedAction && this.props.selectedAction.type === 'command'){
            this.props.onChange(ProgramUtils.overwrite(this.props.program,
                    index, this.props.selectedAction.commandName, 'none'));
            this.props.onSelectAction(null);
        }
    };

    makeProgramBlock(programStepNumber: number, command: string) {
        switch(command) {
            case 'forward':
                return (
                    <Button
                        key={`${programStepNumber}-forward`}
                        data-stepnumber={programStepNumber}
                        className='ProgramBlockEditor__program-block'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                        <ArrowUp/>
                    </Button>
                );
            case 'left':
                return (
                    <Button
                        key={`${programStepNumber}-left`}
                        data-stepnumber={programStepNumber}
                        className='ProgramBlockEditor__program-block'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                        <ArrowLeft/>
                    </Button>
                );
            case 'right':
                return (
                    <Button
                        key={`${programStepNumber}-right`}
                        data-stepnumber={programStepNumber}
                        className='ProgramBlockEditor__program-block'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                        <ArrowRight/>
                    </Button>
                );
            case 'none':
                return (
                    <Button
                        key={`${programStepNumber}-none`}
                        data-stepnumber={programStepNumber}
                        className='ProgramBlockEditor__program-block'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})
                        }
                        variant='light'
                        onClick={this.handleClickStep}>
                        <EmptyBlockIcon className='ProgramBlockEditor__empty-block-svg'/>
                    </Button>
                );
            default:
                return (
                    <div key={`${programStepNumber}-unknown`}/>
                );
        }
    }

    render() {
        var noneAtEnd = this.props.program[this.props.program.length - 1] === 'none';

        const programBlocks = this.props.program.map((command, stepNumber) => {
            return this.makeProgramBlock(stepNumber, command);
        });

        // Ensure that we have at least props.minVisibleSteps
        for (var i = this.props.program.length; i < this.props.minVisibleSteps; i++) {
            programBlocks.push(this.makeProgramBlock(i, 'none'));
            noneAtEnd = true;
        }

        // Ensure that the last block is 'none'
        if (!noneAtEnd) {
            programBlocks.push(this.makeProgramBlock(programBlocks.length, 'none'));
        }

        return (
            <div className='ProgramBlockEditor__container'>
                <Row>
                    <Col className='ProgramBlockEditor__editor-actions'>
                        <Button
                            key='addButton'
                            className='ProgramBlockEditor__editor-action-button'
                            aria-pressed={this.addIsSelected() ? 'true' : 'false'}
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.add'})}
                            variant={this.addIsSelected() ? 'outline-primary' : 'light'}
                            onClick={this.handleClickAdd}>
                            <AddIcon/>
                        </Button>
                        <Button
                            key='deleteButton'
                            className='ProgramBlockEditor__editor-action-button'
                            aria-pressed={this.deleteIsSelected() ? 'true' : 'false'}
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.delete'})}
                            variant={this.deleteIsSelected() ? 'outline-primary' : 'light'}
                            onClick={this.handleClickDelete}>
                            <DeleteIcon/>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className='ProgramBlockEditor__program-sequence'>
                        <div className='ProgramBlockEditor__start-indicator'>
                            Start
                        </div>
                        {programBlocks}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default injectIntl(ProgramBlockEditor);
