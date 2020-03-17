// @flow

import { Col, Collapse, Container, Row } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedAction} from './types';
import React from 'react';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import FocusTrapManager from './FocusTrapManager';
import { ReactComponent as ArrowTurnLeft } from './svg/ArrowTurnLeft.svg';
import { ReactComponent as ArrowTurnRight } from './svg/ArrowTurnRight.svg';
import { ReactComponent as ArrowForward } from './svg/ArrowForward.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import './ProgramBlockEditor.scss';

// TODO: Send focus to Delete toggle button on close of Delete All confirmation dialog

type ProgramBlockEditorProps = {
    intl: any,
    activeProgramStepNum: ?number,
    editingDisabled: boolean,
    interpreterIsRunning: boolean,
    program: Program,
    selectedAction: SelectedAction,
    replaceIsActive: boolean,
    runButtonDisabled: boolean,
    addModeDescriptionId: string,
    deleteModeDescriptionId: string,
    focusTrapManager: FocusTrapManager,
    onClickRunButton: () => void,
    onSetReplaceIsActive: (booleanValue: boolean) => void,
    onSelectAction: (selectedAction: SelectedAction) => void,
    onChange: (Program) => void
};

type ProgramBlockEditorState = {
    showConfirmDeleteAll: boolean,
    showActionPanel: boolean,
    actionPanelPosition: {
        top: number,
        left: number
    },
    currentStepIndex: ?number,
    actionPanelItemFocusIndex: ?number
};

class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    commandBlockRefs: Map<number, HTMLElement>;
    focusIndex: ?number;
    scrollToIndex: ?number;

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.commandBlockRefs = new Map();
        this.focusIndex = null;
        this.scrollToIndex = null;
        this.state = {
            showConfirmDeleteAll : false,
            showActionPanel: false,
            actionPanelPosition: {
                top: 0,
                left: 0
            },
            currentStepIndex: null,
            actionPanelItemFocusIndex: null
        }
    }

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

    commandIsSelected() {
        return (this.props.selectedAction
            && this.props.selectedAction.type === 'command');
    }

    getSelectedCommandName() {
        if (this.commandIsSelected()) {
            // $FlowFixMe
            return this.props.selectedAction.commandName;
        }
    }

    handleClickAdd = () => {
        this.toggleAction('add');
    };

    handleClickDelete = () => {
        this.toggleAction('delete');
        this.focusIndex = this.state.currentStepIndex;
        if (this.state.currentStepIndex) {
            this.props.onChange(ProgramUtils.deleteStep(this.props.program, this.state.currentStepIndex));
        }
    };

    handleClickDeleteAll = () => {
        this.setState({
            showConfirmDeleteAll : true
        });
    }

    handleCancelDeleteAll = () => {
        this.setState({
            showConfirmDeleteAll : false
        });
    }

    handleConfirmDeleteAll = () => {
        this.props.onChange([]);
        this.setState({
            showConfirmDeleteAll : false
        });
    }

    handleMoveUpPosition = () => {
        if (this.state.currentStepIndex != null && this.props.program[this.state.currentStepIndex-1] != null) {
            const currentStepIndex = this.state.currentStepIndex;
            this.setState({
                currentStepIndex: currentStepIndex-1,
                actionPanelItemFocusIndex: 2
            });
            this.props.onChange(
                ProgramUtils.moveUpPosition(
                    this.props.program,
                    currentStepIndex
                )
            );
        }
    }

    handleMoveDownPosition = () => {
        if (this.state.currentStepIndex != null && this.props.program[this.state.currentStepIndex+1] != null) {
            this.props.onChange(
                ProgramUtils.moveDownPosition(
                    this.props.program,
                    this.state.currentStepIndex
                )
            );
            this.setState({
                currentStepIndex: this.state.currentStepIndex+1,
                actionPanelItemFocusIndex: 3
            });
        }
    }

    handleReplaceStep = () => {
        let index = this.state.currentStepIndex;
        if (index != null) {
            if (this.commandIsSelected()) {
                if (this.props.program[index] !== this.getSelectedCommandName()) {
                    this.props.onSetReplaceIsActive(false);
                    this.focusIndex = index;
                    this.props.onChange(ProgramUtils.overwrite(this.props.program,
                            // $FlowFixMe
                            index, this.props.selectedAction.commandName, 'none'));
                    this.scrollToIndex = index + 1;
                } else {
                    this.props.onSetReplaceIsActive(true);
                }
            } else {
                this.props.onSetReplaceIsActive(true);
            }
        }
    }

    handleAdjustActionPanelPosition = (index: number) => {
        const currentActiveButton = document.getElementById(`programBlock-${index}`);

        if (currentActiveButton) {
            let actionPanelPositionObj = {
                top: 0,
                left: 0
            };

            if (
                (!this.state.showActionPanel || this.state.currentStepIndex !== index) &&
                this.props.program[index] != null
                )
            {
                actionPanelPositionObj.top =
                    currentActiveButton.getBoundingClientRect().height/2 -
                    currentActiveButton.getBoundingClientRect().height*2;
                actionPanelPositionObj.left = currentActiveButton.getBoundingClientRect().width/3;
                this.setState({
                    showActionPanel: true,
                    actionPanelPosition: actionPanelPositionObj,
                    currentStepIndex: index
                });
            } else if (this.state.showActionPanel && this.state.currentStepIndex === index){
                this.setState({
                    showActionPanel: false,
                    actionPanelPosition: actionPanelPositionObj,
                    currentStepIndex: null,
                    actionPanelItemFocusIndex: null
                });
            }
        }
    }

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);

        this.handleAdjustActionPanelPosition(index);

        if (this.props.selectedAction && this.props.selectedAction.type === 'editorAction') {
            if (this.props.selectedAction.action === 'add') {
                this.focusIndex = index;
                this.props.onChange(ProgramUtils.insert(this.props.program,
                    index, 'none', 'none'));
                this.scrollToIndex = index + 1;
            } else if (this.props.selectedAction.action === 'delete') {
                this.focusIndex = index;
                this.props.onChange(ProgramUtils.trimEnd(
                    ProgramUtils.deleteStep(this.props.program, index),
                    'none'));
                this.scrollToIndex = null;
            }
        } else if (
            this.props.selectedAction && this.props.selectedAction.type === 'command' && this.props.program[index] == null ){
            this.focusIndex = index;
            this.props.onChange(ProgramUtils.overwrite(this.props.program,
                    index, this.props.selectedAction.commandName, 'none'));
            this.scrollToIndex = index + 1;
        }
    };

    handleCloseActionPanelFocusTrap = () => {
        this.setState({
            showActionPanel: false,
            actionPanelItemFocusIndex: null
        });
    };

    handleCloseReplaceFocusTrap = () => {
        this.props.onSetReplaceIsActive(false);
    };

    setCommandBlockRef = (programStepNumber: number, element: ?HTMLElement) => {
        if (element) {
            this.commandBlockRefs.set(programStepNumber, element);
        } else {
            this.commandBlockRefs.delete(programStepNumber);
        }
    };

    makeProgramBlock(programStepNumber: number, command: string) {
        const active = this.props.activeProgramStepNum === programStepNumber;
        const hasActionPanelControl = this.state.currentStepIndex === programStepNumber;
        let classNames = [
            'ProgramBlockEditor__program-block',
            'command-block'
        ];
        if (active) {
            classNames.push('ProgramBlockEditor__program-block--active');
        }
        switch(command) {
            case 'forward':
                return (
                    <React.Fragment key={programStepNumber}>
                        <div className='ProgramBlockEditor__program-block-connector'/>
                        <div>
                            <AriaDisablingButton
                                id={`programBlock-${programStepNumber}`}
                                ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                                key={`${programStepNumber}-forward`}
                                data-stepnumber={programStepNumber}
                                className={classNames.join(' ')}
                                variant='command-block--forward'
                                aria-label={
                                    this.addIsSelected() ?
                                    `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                    this.deleteIsSelected() ?
                                    `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                    this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})
                                }
                                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                                aria-expanded={hasActionPanelControl && this.state.showActionPanel}
                                disabled={this.props.editingDisabled}
                                onClick={this.handleClickStep}
                            >
                                <ArrowForward className='command-block-svg'/>
                            </AriaDisablingButton>
                            {this.state.currentStepIndex === programStepNumber ?
                                <div style={{
                                position: 'relative',
                                float: 'right'
                                }}>
                                    <ActionPanel
                                        focusIndex={this.state.actionPanelItemFocusIndex}
                                        selectedCommandName={this.getSelectedCommandName()}
                                        program={this.props.program}
                                        currentStepIndex={this.state.currentStepIndex}
                                        showActionPanel={this.state.showActionPanel}
                                        position={this.state.actionPanelPosition}
                                        onDelete={this.handleClickDelete}
                                        onReplace={this.handleReplaceStep}
                                        onMoveUpPosition={this.handleMoveUpPosition}
                                        onMoveDownPosition={this.handleMoveDownPosition}/>
                                </div> :
                                <></>
                            }
                        </div>
                    </React.Fragment>
                );
            case 'left':
                return (
                    <React.Fragment key={programStepNumber}>
                        <div className='ProgramBlockEditor__program-block-connector'/>
                        <div>
                            <AriaDisablingButton
                                id={`programBlock-${programStepNumber}`}
                                ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                                key={`${programStepNumber}-left`}
                                data-stepnumber={programStepNumber}
                                className={classNames.join(' ')}
                                variant='command-block--left'
                                aria-label={
                                    this.addIsSelected() ?
                                    `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                    this.deleteIsSelected() ?
                                    `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                    this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})
                                }
                                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                                aria-expanded={hasActionPanelControl && this.state.showActionPanel}
                                disabled={this.props.editingDisabled}
                                onClick={this.handleClickStep}
                            >
                                <ArrowTurnLeft className='command-block-svg'/>
                            </AriaDisablingButton>
                            {this.state.currentStepIndex === programStepNumber ?
                                <div style={{
                                position: 'relative',
                                float: 'right'
                                }}>
                                    <ActionPanel
                                        focusIndex={this.state.actionPanelItemFocusIndex}
                                        selectedCommandName={this.getSelectedCommandName()}
                                        program={this.props.program}
                                        currentStepIndex={this.state.currentStepIndex}
                                        showActionPanel={this.state.showActionPanel}
                                        position={this.state.actionPanelPosition}
                                        onDelete={this.handleClickDelete}
                                        onReplace={this.handleReplaceStep}
                                        onMoveUpPosition={this.handleMoveUpPosition}
                                        onMoveDownPosition={this.handleMoveDownPosition}/>
                                </div> :
                                <></>
                            }
                        </div>
                    </React.Fragment>
                );
            case 'right':
                return (
                    <React.Fragment key={programStepNumber}>
                        <div className='ProgramBlockEditor__program-block-connector'/>
                        <div>
                            <AriaDisablingButton
                                id={`programBlock-${programStepNumber}`}
                                ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                                key={`${programStepNumber}-right`}
                                data-stepnumber={programStepNumber}
                                className={classNames.join(' ')}
                                variant='command-block--right'
                                aria-label={
                                    this.addIsSelected() ?
                                    `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                    this.deleteIsSelected() ?
                                    `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                    this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})
                                }
                                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                                aria-expanded={hasActionPanelControl && this.state.showActionPanel}
                                disabled={this.props.editingDisabled}
                                onClick={this.handleClickStep}
                            >
                                <ArrowTurnRight className='command-block-svg'/>
                            </AriaDisablingButton>
                            {this.state.currentStepIndex === programStepNumber ?
                                <div style={{
                                position: 'relative',
                                float: 'right'
                                }}>
                                    <ActionPanel
                                        focusIndex={this.state.actionPanelItemFocusIndex}
                                        selectedCommandName={this.getSelectedCommandName()}
                                        program={this.props.program}
                                        currentStepIndex={this.state.currentStepIndex}
                                        showActionPanel={this.state.showActionPanel}
                                        position={this.state.actionPanelPosition}
                                        onDelete={this.handleClickDelete}
                                        onReplace={this.handleReplaceStep}
                                        onMoveUpPosition={this.handleMoveUpPosition}
                                        onMoveDownPosition={this.handleMoveDownPosition}/>
                                </div> :
                                <></>
                            }
                        </div>
                    </React.Fragment>
                );
            case 'none':
                return (
                    <React.Fragment key={programStepNumber}>
                        <div className='ProgramBlockEditor__program-block-connector'/>
                        <AriaDisablingButton
                            id={`programBlock-${programStepNumber}`}
                            ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                            key={`${programStepNumber}-none`}
                            data-stepnumber={programStepNumber}
                            className={classNames.join(' ')}
                            variant='command-block--none'
                            aria-label={
                                this.addIsSelected() ?
                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                                this.deleteIsSelected() ?
                                `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                                this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})
                            }
                            aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                            aria-expanded={hasActionPanelControl && this.state.showActionPanel}
                            disabled={this.props.editingDisabled}
                            onClick={this.handleClickStep}
                        />
                    </React.Fragment>
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

        // Ensure that the last block is 'none'
        if (!noneAtEnd) {
            programBlocks.push(this.makeProgramBlock(programBlocks.length, 'none'));
        }

        return (
            <Container className='ProgramBlockEditor__container'>
                <Row className='ProgramBlockEditor__header'>
                    <Col>
                        <h2 className='ProgramBlockEditor__heading'>
                            <FormattedMessage id='ProgramBlockEditor.programHeading' />
                        </h2>
                    </Col>
                    <div className='ProgramBlockEditor__editor-actions'>
                        <AriaDisablingButton
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.delete'})}
                            aria-describedby={this.props.deleteModeDescriptionId}
                            className={this.deleteIsSelected() ?
                                        'ProgramBlockEditor__editor-action-button ProgramBlockEditor__editor-action-button--pressed' :
                                        'ProgramBlockEditor__editor-action-button'}
                            disabledClassName='ProgramBlockEditor__editor-action-button--disabled'
                            disabled={this.props.editingDisabled}
                            onClick={this.handleClickDelete}
                            aria-pressed={this.deleteIsSelected() ? 'true' : 'false'}
                            key='deleteButton'
                        >
                            <DeleteIcon className='ProgramBlockEditor__editor-action-button-svg'/>
                        </AriaDisablingButton>
                    </div>
                </Row>
                <Row className='ProgramBlockEditor__delete-all-button-container'>
                    <Collapse in={this.deleteIsSelected()}>
                        <AriaDisablingButton
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.deleteAll'})}
                            className={'ProgramBlockEditor__delete-all-button'}
                            disabledClassName='ProgramBlockEditor__delete-all-button--disabled'
                            disabled={this.props.editingDisabled}
                            onClick={this.handleClickDeleteAll}
                        >
                            <FormattedMessage id='ProgramBlockEditor.deleteAll' />
                        </AriaDisablingButton>
                    </Collapse>
                </Row>
                <Row>
                    <Col className='ProgramBlockEditor__program-sequence-scroll-container' id='programSequenceContainer'>
                        <div className='ProgramBlockEditor__program-sequence'>
                            <div className='ProgramBlockEditor__start-indicator'>
                                {this.props.intl.formatMessage({id:'ProgramBlockEditor.startIndicator'})}
                            </div>
                            {programBlocks}
                        </div>
                    </Col>
                </Row>
                <Row className='ProgramBlockEditor__footer'>
                    <Col>
                        <AriaDisablingButton
                            aria-label={`${this.props.intl.formatMessage({id:'PlayButton.run'})} ${this.props.program.join(' ')}`}
                            className={this.props.interpreterIsRunning ?
                                'ProgramBlockEditor__run-button ProgramBlockEditor__run-button--pressed' :
                                'ProgramBlockEditor__run-button'}
                            disabledClassName='ProgramBlockEditor__run-button--disabled'
                            disabled={this.props.runButtonDisabled}
                            onClick={this.props.onClickRunButton}
                        >
                            <PlayIcon className='ProgramBlockEditor__play-svg' />
                        </AriaDisablingButton>
                    </Col>
                </Row>
                <ConfirmDeleteAllModal
                    show={this.state.showConfirmDeleteAll}
                    onCancel={this.handleCancelDeleteAll}
                    onConfirm={this.handleConfirmDeleteAll}/>
            </Container>
        );
    }

    componentDidUpdate() {
        if (this.scrollToIndex != null) {
            let element = this.commandBlockRefs.get(this.scrollToIndex);
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
            this.scrollToIndex = null;
        }
        if (this.focusIndex != null) {
            let element = this.commandBlockRefs.get(this.focusIndex);
            if (element) {
                element.focus();
            }
            this.focusIndex = null;
        }
        if (this.props.activeProgramStepNum != null) {
            let element = this.commandBlockRefs.get(this.props.activeProgramStepNum);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }
        if (this.state.showActionPanel && (this.state.currentStepIndex != null)) {
            if (this.props.replaceIsActive) {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseReplaceFocusTrap,
                    ['.replace-action-button', '.App__command-palette button'],
                    '.replace-action-button'
                );
            } else {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseActionPanelFocusTrap,
                    [`#programBlock-${this.state.currentStepIndex}`, '.ActionPanel__panel button'],
                    `#programBlock-${this.state.currentStepIndex}`
                );
            }
        } else {
            this.props.focusTrapManager.unsetFocusTrap();
        }
    }
}

export default injectIntl(ProgramBlockEditor);
