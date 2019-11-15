// @flow

import { Button, Col, Image, Row } from 'react-bootstrap';
import {injectIntl} from 'react-intl';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedAction} from './types';
import React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import addIcon from 'material-design-icons/content/svg/production/ic_add_24px.svg';
import deleteIcon from 'material-design-icons/content/svg/production/ic_clear_24px.svg';
import emptyBlockIcon from 'material-design-icons/toggle/svg/production/ic_check_box_outline_blank_48px.svg';
import './ProgramBlockEditor.css';

type ProgramBlockEditorProps = {
    intl: any,
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
                            <Image src={addIcon} />
                        </Button>
                        <Button
                            key='deleteButton'
                            className='ProgramBlockEditor__editor-action-button'
                            aria-pressed={this.deleteIsSelected() ? 'true' : 'false'}
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.delete'})}
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
                                case 'forward':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-forward`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={
                                                this.addIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                                this.deleteIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                                this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})
                                            }
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowUp} />
                                        </Button>
                                    );
                                case 'left':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-left`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={
                                                this.addIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                                this.deleteIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                                this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})
                                            }
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowLeft} />
                                        </Button>
                                    );
                                case 'right':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-right`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={
                                                this.addIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                                this.deleteIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                                this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})
                                            }
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowRight} />
                                        </Button>
                                    );
                                case 'none':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-none`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={
                                                this.addIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                                this.deleteIsSelected() ?
                                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                                this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})
                                            }
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={emptyBlockIcon} />
                                        </Button>
                                    );
                                default:
                                    return (
                                        <div key={`${programStepNumber}-unknown`}/>
                                    );
                            }
                        })}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default injectIntl(ProgramBlockEditor);
