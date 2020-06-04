// @flow

import { Col, Collapse, Container, Row } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedAction} from './types';
import React from 'react';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import AddNode from './AddNode';
import AddNodeToggleSwitch from './AddNodeToggleSwitch';
import AriaDisablingButton from './AriaDisablingButton';
import CommandBlock from './CommandBlock';
import classNames from 'classnames';
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
    isDraggingCommand: boolean,
    runButtonDisabled: boolean,
    addModeDescriptionId: string,
    deleteModeDescriptionId: string,
    onClickRunButton: () => void,
    onSelectAction: (selectedAction: SelectedAction) => void,
    onChange: (Program) => void
};

type ProgramBlockEditorState = {
    showConfirmDeleteAll: boolean,
    addNodeExpandedMode: boolean
};

class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    commandBlockRefs: Map<number, HTMLElement>;
    addNodeRefs: Map<number, HTMLElement>;
    focusCommandBlockIndex: ?number;
    scrollToAddNodeIndex: ?number;

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.commandBlockRefs = new Map();
        this.addNodeRefs = new Map();
        this.focusCommandBlockIndex = null;
        this.scrollToAddNodeIndex = null;
        this.state = {
            showConfirmDeleteAll : false,
            addNodeExpandedMode : false
        }
    }

    toggleAction(action: 'delete') {
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

    deleteIsSelected() {
        return this.actionIsSelected('delete');
    }

    commandIsSelected() {
        return (this.props.selectedAction
            && this.props.selectedAction.type === 'command');
    }

    getSelectedCommandName() {
        if (this.props.selectedAction
                && this.props.selectedAction.type === 'command') {
            return this.props.selectedAction.commandName;
        } else {
            return null;
        }
    }

    handleChangeAddNodeExpandedMode = (isAddNodeExpandedMode: boolean) => {
        this.setState({
            addNodeExpandedMode: isAddNodeExpandedMode
        });
    }

    handleClickDelete = () => {
        this.toggleAction('delete');
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

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);

        if (this.props.selectedAction && this.props.selectedAction.type === 'editorAction') {
            if (this.props.selectedAction.action === 'delete') {
                this.focusCommandBlockIndex = index;
                this.props.onChange(ProgramUtils.trimEnd(
                    ProgramUtils.deleteStep(this.props.program, index),
                    'none'));
                this.scrollToAddNodeIndex = null;
            }
        }
    };

    handleClickAddNode = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);
        this.insertSelectedCommandIntoProgram(index);
    };

    handleDropCommand = (e: SyntheticDragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);
        this.insertSelectedCommandIntoProgram(index);
    };

    insertSelectedCommandIntoProgram(index: number) {
        if (this.props.selectedAction && this.props.selectedAction.type === 'command') {
            this.focusCommandBlockIndex = index;
            this.scrollToAddNodeIndex = index + 1;
            this.props.onChange(ProgramUtils.insert(this.props.program,
                index, this.props.selectedAction.commandName, 'none'));
        }
    }

    setCommandBlockRef = (programStepNumber: number, element: ?HTMLElement) => {
        if (element) {
            this.commandBlockRefs.set(programStepNumber, element);
        }
    };

    setAddNodeRef = (programStepNumber: number, element: ?HTMLElement) => {
        if (element) {
            this.addNodeRefs.set(programStepNumber, element);
        }
    };

    programIsActive = (programStepNumber: number) => {
        if (this.props.interpreterIsRunning && this.props.activeProgramStepNum != null) {
            return (this.props.activeProgramStepNum) === programStepNumber;
        } else {
            return false;
        }
    }

    makeProgramBlock(programStepNumber: number, command: string) {
        const active = this.programIsActive(programStepNumber);

        const classes = classNames(
            'ProgramBlockEditor__program-block',
            active && 'ProgramBlockEditor__program-block--active'
        );
        let ariaLabel = '';
        if (command !== 'addNode') {
            ariaLabel = this.props.intl.formatMessage(
                { id: `ProgramBlockEditor.command.${command}` },
                { index: programStepNumber + 1 }
            );
        }

        if (this.deleteIsSelected()) {
            ariaLabel += `. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}`;
        }

        return (
            <CommandBlock
                commandName={command}
                ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                key={`${programStepNumber}-${command}`}
                data-stepnumber={programStepNumber}
                data-command={command}
                className={classes}
                aria-label={ariaLabel}
                disabled={this.props.editingDisabled}
                onClick={this.handleClickStep}
            />
        );
    }

    makeNodeAriaLabel = (programStepNumber: number) => {
        const isBeginningBlock = (programStepNumber === 0);
        if (isBeginningBlock) {
            if (this.commandIsSelected()) {
                return this.props.intl.formatMessage(
                    {id: 'ProgramBlockEditor.beginningBlock'},
                    {
                        command: this.getSelectedCommandName()
                    });
            } else {
                return this.props.intl.formatMessage({id: 'ProgramBlockEditor.blocks.noCommandSelected'});
            }
        } else {
            if (this.commandIsSelected()) {
                return this.props.intl.formatMessage(
                    {id: 'ProgramBlockEditor.betweenBlocks'},
                    {
                        command: this.getSelectedCommandName(),
                        prevCommand: `${programStepNumber}, ${this.props.program[programStepNumber-1]}`,
                        postCommand: `${programStepNumber+1}, ${this.props.program[programStepNumber]}`
                    });
            } else {
                return this.props.intl.formatMessage({id: 'ProgramBlockEditor.blocks.noCommandSelected'});
            }
        }
    }

    makeProgramBlockSection(programStepNumber: number, command: string) {
        return (
            <React.Fragment key={programStepNumber}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <React.Fragment>
                    <AddNode
                        aria-label={this.makeNodeAriaLabel(programStepNumber)}
                        ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                        expandedMode={this.state.addNodeExpandedMode}
                        isDraggingCommand={this.props.isDraggingCommand}
                        programStepNumber={programStepNumber}
                        disabled={
                            this.props.editingDisabled ||
                            (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                        onClick={this.handleClickAddNode}
                        onDrop={this.handleDropCommand}
                    />
                    <div className='ProgramBlockEditor__program-block-connector' />
                    {this.makeProgramBlock(programStepNumber, command)}
                </React.Fragment>
            </React.Fragment>
        );
    }

    makeEndOfProgramAddNodeSection(programStepNumber: number) {
        return (
            <React.Fragment key={programStepNumber}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <AddNode
                    aria-label={
                        this.commandIsSelected() ?
                        this.props.intl.formatMessage(
                        { id: 'ProgramBlockEditor.lastBlock' },
                        { command: this.getSelectedCommandName() }) :
                        this.props.intl.formatMessage(
                        {id: 'ProgramBlockEditor.blocks.noCommandSelected'})}
                    ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                    expandedMode={true}
                    isDraggingCommand={this.props.isDraggingCommand}
                    programStepNumber={programStepNumber}
                    disabled={
                        this.props.editingDisabled ||
                        (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                    onClick={this.handleClickAddNode}
                    onDrop={this.handleDropCommand}
                />
            </React.Fragment>
        )
    }

    render() {
        const contents = this.props.program.map((command, stepNumber) => {
            return this.makeProgramBlockSection(stepNumber, command);
        });

        contents.push(this.makeEndOfProgramAddNodeSection(this.props.program.length));

        return (
            <Container className='ProgramBlockEditor__container'>
                <Row className='ProgramBlockEditor__header'>
                    <Col>
                        <h2 className='ProgramBlockEditor__heading'>
                            <FormattedMessage id='ProgramBlockEditor.programHeading' />
                        </h2>
                    </Col>
                    <div className='ProgramBlockEditor__editor-actions'>
                        <AddNodeToggleSwitch
                            isAddNodeExpandedMode={this.state.addNodeExpandedMode}
                            onChange={this.handleChangeAddNodeExpandedMode}
                        />
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
                    <Col className='ProgramBlockEditor__program-sequence-scroll-container'>
                        <div className='ProgramBlockEditor__program-sequence'>
                            <div className='ProgramBlockEditor__start-indicator'>
                                {this.props.intl.formatMessage({id:'ProgramBlockEditor.startIndicator'})}
                            </div>
                            {contents}
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
        if (this.scrollToAddNodeIndex != null) {
            let element = this.addNodeRefs.get(this.scrollToAddNodeIndex);
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
            this.scrollToAddNodeIndex = null;
        }
        if (this.focusCommandBlockIndex != null) {
            let element = this.commandBlockRefs.get(this.focusCommandBlockIndex);
            if (element) {
                element.focus();
            }
            this.focusCommandBlockIndex = null;
        }
        if (this.props.activeProgramStepNum != null) {
            let element = this.commandBlockRefs.get(this.props.activeProgramStepNum);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }
    }
}

export default injectIntl(ProgramBlockEditor);
