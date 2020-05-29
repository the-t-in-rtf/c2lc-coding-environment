// @flow

import { injectIntl, FormattedMessage } from 'react-intl';
import * as ProgramUtils from './ProgramUtils';
import type {Program} from './types';
import React from 'react';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import FocusTrapManager from './FocusTrapManager';
import CommandBlock from './CommandBlock';
import classNames from 'classnames';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import { ReactComponent as RefreshIcon } from './svg/Refresh.svg';
import './ProgramBlockEditor.scss';

// TODO: Send focus to Delete toggle button on close of Delete All confirmation dialog

type ProgramBlockEditorProps = {
    intl: any,
    activeProgramStepNum: ?number,
    editingDisabled: boolean,
    interpreterIsRunning: boolean,
    program: Program,
    selectedAction: ?string,
    replaceIsActive: boolean,
    runButtonDisabled: boolean,
    focusTrapManager: FocusTrapManager,
    onClickRunButton: () => void,
    onSetReplaceIsActive: (booleanValue: boolean) => void,
    onChange: (Program) => void
};

type ProgramBlockEditorState = {
    showConfirmDeleteAll: boolean,
    showActionPanel: boolean,
    actionPanelPosition: {
        top: number,
        right: number
    },
    pressedStepIndex: ?number,
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
                right: 0
            },
            pressedStepIndex: null,
            actionPanelItemFocusIndex: null
        }
    }

    handleClickDelete = () => {
        this.focusIndex = this.state.pressedStepIndex;
        if (this.state.pressedStepIndex != null) {
            this.props.onChange(ProgramUtils.deleteStep(this.props.program, this.state.pressedStepIndex));
            this.handleCloseActionPanelFocusTrap();
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
        if (this.state.pressedStepIndex != null && this.props.program[this.state.pressedStepIndex-1] != null) {
            const pressedStepIndex = this.state.pressedStepIndex;
            this.setState({
                pressedStepIndex: pressedStepIndex-1,
                actionPanelItemFocusIndex: 2
            });
            this.props.onChange(
                ProgramUtils.moveUpPosition(
                    this.props.program,
                    pressedStepIndex
                )
            );
        }
    }

    handleMoveDownPosition = () => {
        if (this.state.pressedStepIndex != null && this.props.program[this.state.pressedStepIndex+1] != null) {
            this.props.onChange(
                ProgramUtils.moveDownPosition(
                    this.props.program,
                    this.state.pressedStepIndex
                )
            );
            this.setState({
                pressedStepIndex: this.state.pressedStepIndex+1,
                actionPanelItemFocusIndex: 3
            });
        }
    }

    handleReplaceStep = () => {
        let index = this.state.pressedStepIndex;
        if (index != null) {
            if (this.props.selectedAction) {
                if (this.props.program[index] !== this.props.selectedAction) {
                    this.props.onChange(ProgramUtils.overwrite(this.props.program,
                            index, this.props.selectedAction, 'none'));
                    this.props.onSetReplaceIsActive(false);
                    this.focusIndex = index;
                    this.scrollToIndex = index + 1;
                } else {
                    this.props.onSetReplaceIsActive(true);
                }
            } else {
                this.props.onSetReplaceIsActive(true);
            }
        }
    }

    handleActionPanelDisplay = (index: number) => {
        const currentStepButton = this.commandBlockRefs.get(index);

        if (currentStepButton) {
            let actionPanelPositionObj = {
                top: 0,
                right: 0
            };

            if (
                (!this.state.showActionPanel || this.state.pressedStepIndex !== index) &&
                this.props.program[index] != null
                )
            {
                actionPanelPositionObj.top =
                    -currentStepButton.getBoundingClientRect().height/2 -
                    currentStepButton.getBoundingClientRect().height*2.1;
                actionPanelPositionObj.right = -currentStepButton.getBoundingClientRect().width/1.25;
                this.setState({
                    showActionPanel: true,
                    actionPanelPosition: actionPanelPositionObj,
                    pressedStepIndex: index
                });
            } else if (
                (this.state.showActionPanel && this.state.pressedStepIndex === index) ||
                (this.state.showActionPanel && this.props.program[index] == null)){
                this.setState({
                    showActionPanel: false,
                    actionPanelPosition: actionPanelPositionObj,
                    pressedStepIndex: null,
                    actionPanelItemFocusIndex: null
                });
            }
        }
    }

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);
        this.handleActionPanelDisplay(index);
        if (this.props.selectedAction && this.props.program[index] == null ){
            this.focusIndex = index;
            this.props.onChange(ProgramUtils.overwrite(this.props.program,
                    index, this.props.selectedAction, 'none'));
            this.scrollToIndex = index + 1;
        }
    };

    handleCloseActionPanelFocusTrap = () => {
        this.setState({
            showActionPanel: false,
            actionPanelItemFocusIndex: null,
            pressedStepIndex: null
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
        const hasActionPanelControl = this.state.pressedStepIndex === programStepNumber;
        const classes = classNames(
            'ProgramBlockEditor__program-block',
            active && 'ProgramBlockEditor__program-block--active',
            hasActionPanelControl && 'ProgramBlockEditor__program-block--pressed'
        );

        let ariaLabel = this.props.intl.formatMessage(
            { id: `ProgramBlockEditor.command.${command}` },
            { index: programStepNumber + 1 }
        );

        return (
            <CommandBlock
                commandName={command}
                ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                key={`${programStepNumber}-${command}`}
                data-stepnumber={programStepNumber}
                data-command={command}
                className={classes}
                aria-label={ariaLabel}
                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                aria-expanded={hasActionPanelControl && this.state.showActionPanel}
                disabled={this.props.editingDisabled}
                onClick={this.handleClickStep}
            />
        );
    }

    makeProgramBlockSection(programStepNumber: number, command: string) {
        return (
            <React.Fragment key={programStepNumber}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <div className='ProgramBlockEditor__program-block-with-panel'>
                    {this.makeProgramBlock(programStepNumber, command)}
                    {this.state.pressedStepIndex === programStepNumber ?
                        <div style={{
                        position: 'relative',
                        float: 'top'
                        }}>
                            <ActionPanel
                                focusIndex={this.state.actionPanelItemFocusIndex}
                                selectedCommandName={this.props.selectedAction}
                                program={this.props.program}
                                pressedStepIndex={this.state.pressedStepIndex}
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
    }

    render() {
        var noneAtEnd = this.props.program[this.props.program.length - 1] === 'none';

        const contents = this.props.program.map((command, stepNumber) => {
            return this.makeProgramBlockSection(stepNumber, command);
        });

        // Ensure that the last block is 'none'
        if (!noneAtEnd) {
            contents.push(this.makeProgramBlockSection(this.props.program.length, 'none'));
        }

        return (
            <div className='ProgramBlockEditor__container'>
                <div className='ProgramBlockEditor__header'>
                    <h2 className='ProgramBlockEditor__heading'>
                        <FormattedMessage id='ProgramBlockEditor.programHeading' />
                    </h2>
                </div>
                <div className='ProgramBlockEditor__program-sequence-scroll-container' id='programSequenceContainer'>
                    <div className='ProgramBlockEditor__program-sequence'>
                        <div className='ProgramBlockEditor__start-indicator'>
                            {this.props.intl.formatMessage({id:'ProgramBlockEditor.startIndicator'})}
                        </div>
                        {contents}
                    </div>
                </div>
                <div className='ProgramBlockEditor__footer'>
                    <div className='ProgramBlockEditor__run'>
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
                    </div>
                    <div className='ProgramBlockEditor__editor-actions'>
                        <AriaDisablingButton
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.clear'})}
                            className='ProgramBlockEditor__editor-action-button'
                            disabledClassName='ProgramBlockEditor__editor-action-button--disabled'
                            disabled={this.props.editingDisabled}
                            onClick={this.handleClickDeleteAll}
                            key='deleteButton'
                        >
                            <RefreshIcon className='ProgramBlockEditor__editor-action-button-svg'/>
                        </AriaDisablingButton>
                    </div>
                </div>
                <ConfirmDeleteAllModal
                    show={this.state.showConfirmDeleteAll}
                    onCancel={this.handleCancelDeleteAll}
                    onConfirm={this.handleConfirmDeleteAll}/>
            </div>
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
        if (this.state.showActionPanel && (this.state.pressedStepIndex != null)) {
            if (this.props.replaceIsActive) {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseReplaceFocusTrap,
                    ['.replace-action-button', '.App__command-palette button'],
                    '.replace-action-button'
                );
            } else {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseActionPanelFocusTrap,
                    ['.ProgramBlockEditor__program-block--pressed', '.ActionPanel__panel button'],
                    '.ProgramBlockEditor__program-block--pressed'
                );
            }
        } else {
            this.props.focusTrapManager.unsetFocusTrap();
        }
    }
}

export default injectIntl(ProgramBlockEditor);
