// @flow

import { Button, Col, Image, Row } from 'react-bootstrap';
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
            <div className='ProgramBlockEditor__container'>
                <Row>
                    <Col className='ProgramBlockEditor__editor-actions'>
                        <Button
                            key='addButton'
                            className='ProgramBlockEditor__editor-action-button'
                            aria-label={this.addIsSelected() ? 'deactivate add a program to the sequence mode' : 'activate add a program to the sequence mode'}
                            variant={this.addIsSelected() ? 'outline-primary' : 'light'}
                            onClick={this.handleClickAdd}>
                            <Image src={addIcon} />
                        </Button>
                        <Button
                            key='deleteButton'
                            className='ProgramBlockEditor__editor-action-button'
                            aria-label={this.deleteIsSelected() ? 'deactivate delete a program from the sequence mode' : 'activate delete a program from the sequence mode'}
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
                                            aria-label={this.addIsSelected() ? `Forward button. Press to add an empty command block after this` : this.deleteIsSelected() ? `Forward button. Press to delete this command` : 'Forward button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowUp} />
                                        </Button>
                                    );
                                case 'left':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-left`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={this.addIsSelected() ? `Left button. Press to add an empty command block after this` : this.deleteIsSelected() ? `Left button. Press to delete this command` : 'Left button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowLeft} />
                                        </Button>
                                    );
                                case 'right':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-right`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={this.addIsSelected() ? `Right button. Press to add an empty command block after this` : this.deleteIsSelected() ? `Right button. Press to delete this command` : 'Right button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowRight} />
                                        </Button>
                                    );
                                case 'none':
                                    return (
                                        <Button
                                            key={`${programStepNumber}-none`}
                                            className='ProgramBlockEditor__program-block'
                                            aria-label={this.addIsSelected() ? `Empty blcok button. Press to add an empty command block after this` : this.deleteIsSelected() ? `Empty block button. Press to delete this command` : 'Empty block button'}
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
