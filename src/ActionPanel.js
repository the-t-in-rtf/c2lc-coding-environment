// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import type { Program } from './types';
import { ReactComponent as MoveUpIcon } from './svg/up.svg';
import { ReactComponent as MoveDownIcon } from './svg/down.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import { ReactComponent as ReplaceIcon } from './svg/replace.svg';
import './ActionPanel.scss';

type ActionPanelProps = {
    focusIndex: ?number,
    selectedCommandName: ?string,
    program: Program,
    pressedStepIndex: ?number,
    position: {
        top: number,
        right: number
    },
    intl: any,
    onDelete: () => void,
    onReplace: () => void,
    onMoveUpPosition: () => void,
    onMoveDownPosition: () => void
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    actionPanelRef: { current: null | HTMLDivElement };
    constructor(props) {
        super(props);
        this.actionPanelRef = React.createRef();
    }

    setStepInfoMessage = () => {
        if (this.props.pressedStepIndex != null) {
            const currentStepName = this.props.program[this.props.pressedStepIndex];
            const prevStepName =
                this.props.program[this.props.pressedStepIndex - 1] ?
                this.props.program[this.props.pressedStepIndex - 1] :
                undefined;
            const postStepName =
                this.props.program[this.props.pressedStepIndex + 1] ?
                this.props.program[this.props.pressedStepIndex + 1] :
                undefined;
            let ariaLabelObj = {};
            ariaLabelObj['stepNumber'] = this.props.pressedStepIndex + 1;

            if (this.props.selectedCommandName) {
                ariaLabelObj['selectedCommandName'] =
                    this.props.intl.formatMessage(
                        { id: 'ActionPanel.selectedCommandName' },
                        { selectedCommandName: this.props.selectedCommandName }
                    );
            }

            if (currentStepName === 'forward') {
                ariaLabelObj['stepName'] =
                    this.props.intl.formatMessage({id:'ActionPanel.commandName.forward'});
            } else if (currentStepName === 'right' || currentStepName === 'left') {
                ariaLabelObj['stepName'] =
                    this.props.intl.formatMessage(
                        { id: 'ActionPanel.commandName.turn' },
                        { stepName: currentStepName }
                    );
            }

            if (prevStepName !== null && this.props.pressedStepIndex) {
                if (prevStepName === 'forward') {
                    ariaLabelObj['prevStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'ActionPanel.prevStepInfo.forward' },
                            { prevStepNumber: this.props.pressedStepIndex }
                        );
                } else if (prevStepName === 'right' || prevStepName === 'left') {
                    ariaLabelObj['prevStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'ActionPanel.prevStepInfo.turn' },
                            {
                                prevStepNumber: this.props.pressedStepIndex,
                                prevStepName
                            }
                        );
                }
            }

            if (postStepName !== null) {
                if (postStepName === 'forward') {
                    ariaLabelObj['postStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'ActionPanel.postStepInfo.forward' },
                            { postStepNumber: this.props.pressedStepIndex + 2 }
                        );
                } else if (postStepName === 'right' || postStepName === 'left') {
                    ariaLabelObj['postStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'ActionPanel.postStepInfo.turn' },
                            {
                                postStepNumber: this.props.pressedStepIndex + 2 ,
                                postStepName
                            }
                        )
                }
            }
            return ariaLabelObj;
        }
    }

    render() {
        const positionStyles = {
            position: 'absolute',
            top: this.props.position.top,
            right: this.props.position.right
        }
        const stepInfoMessage = Object.assign({
            'stepNumber': 0,
            'stepName': '',
            'selectedCommandName': '',
            'prevStepInfo': '',
            'postStepInfo': ''
        }, this.setStepInfoMessage());
        return (
            <div
                id='ActionPanel'
                className={'ActionPanel__panel'}
                style={positionStyles}
                ref={this.actionPanelRef}>
                <Button
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onDelete}>
                    <DeleteIcon className='ActionPanel__action-button-svg' />
                </Button>
                <Button
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.replace'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons replace-action-button'
                    onClick={this.props.onReplace}>
                    <ReplaceIcon className='ActionPanel__action-button-svg' />
                </Button>
                <Button
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveUp'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onMoveUpPosition}>
                    <MoveUpIcon className='ActionPanel__action-button-svg' />
                </Button>
                <Button
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveDown'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onMoveDownPosition}>
                    <MoveDownIcon className='ActionPanel__action-button-svg' />
                </Button>
            </div>
        )
    }

    componentDidMount() {
        const element = this.actionPanelRef.current;
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            if (this.props.focusIndex != null) {
                element.children[this.props.focusIndex].focus();
            } else {
                element.focus();
            }
        }
    }
}

export default injectIntl(ActionPanel);
