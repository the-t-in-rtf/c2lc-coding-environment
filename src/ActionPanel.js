// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import type { Program } from './types';
import { ReactComponent as MoveUpIcon } from './svg/up.svg';
import { ReactComponent as MoveDownIcon } from './svg/down.svg';
import { ReactComponent as DeleteIcon } from './svg/delete.svg';
import { ReactComponent as ReplaceIcon } from './svg/replace.svg';
import './ActionPanel.scss';

type ActionPanelProps = {
    selectedCommandName: ?string,
    program: Program,
    currentStepIndex: ?number,
    showActionPanel: boolean,
    position: {
        top: number,
        left: number
    },
    intl: any,
    onDelete: () => void,
    onReplace: () => void,
    onMoveUpPosition: () => void,
    onMoveDownPosition: () => void,
    onKeyDown: () => void
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    actionPanelRef: { current: null | HTMLDivElement };
    constructor(props) {
        super(props);
        this.actionPanelRef = React.createRef();
    }

    setStepInfoMessage = () => {
        if (this.props.currentStepIndex) {
            const currentStepName = this.props.program[this.props.currentStepIndex];
            const prevStepName =
                this.props.program[this.props.currentStepIndex - 1] ?
                this.props.program[this.props.currentStepIndex - 1] :
                null;
            const postStepName =
                this.props.program[this.props.currentStepIndex + 1] ?
                this.props.program[this.props.currentStepIndex + 1] :
                null;
            let ariaLabelObj = {};
            ariaLabelObj['stepNumber'] = this.props.currentStepIndex + 1 || '';

            if (this.props.selectedCommandName) {
                ariaLabelObj['selectedCommandName'] = `with selected action ${this.props.selectedCommandName}`;
            } else {
                ariaLabelObj['selectedCommandName'] = '';
            }

            if (currentStepName === 'forward') {
                ariaLabelObj['stepName'] = 'go forward';
            } else if (currentStepName === 'right' || currentStepName === 'left') {
                ariaLabelObj['stepName'] = `turn ${currentStepName}`;
            } else {
                ariaLabelObj['stepName'] = '';
            }

            if (prevStepName !== null) {
                if (prevStepName === 'forward') {
                    // $FlowFixMe
                    ariaLabelObj['prevStepInfo'] = `after Step ${this.props.currentStepIndex} go forward`;
                } else if (prevStepName === 'right' || prevStepName === 'left') {
                    // $FlowFixMe
                    ariaLabelObj['prevStepInfo'] = `after Step ${this.props.currentStepIndex} turn ${prevStepName}`;
                }
            } else {
                ariaLabelObj['prevStepInfo'] = '';
            }

            if (postStepName !== null) {
                if (postStepName === 'forward') {
                    ariaLabelObj['postStepInfo'] = `before Step ${this.props.currentStepIndex + 2} go forward`;
                } else if (postStepName === 'right' || postStepName === 'left') {
                    ariaLabelObj['postStepInfo'] = `before Step ${this.props.currentStepIndex + 2} turn ${postStepName}`;
                }
            } else {
                ariaLabelObj['postStepInfo'] = '';
            }
            return ariaLabelObj;
        }
    }

    render() {
        const positionStyles = {
            position: 'absolute',
            top: this.props.position.top - 150,
            left: this.props.position.left
        }
        const stepInfoMessage = this.setStepInfoMessage();
        return (
            <div
                id='ActionPanel'
                className={
                    this.props.showActionPanel ?
                    'ActionPanel__panel' :
                    'ActionPanel__panel--hidden'}
                style={positionStyles}
                ref={this.actionPanelRef}
                onKeyDown={this.props.onKeyDown}>
                <Button
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, stepInfoMessage)}
                    id='deleteAction'
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onDelete}>
                    <DeleteIcon className='ActionPanel__action-button-svg' />
                </Button>
                <Button
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.replace'}, stepInfoMessage)}
                    id='replaceAction'
                    className='ActionPanel__action-buttons'
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
                    id='moveDownAction'
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onMoveDownPosition}>
                    <MoveDownIcon className='ActionPanel__action-button-svg' />
                </Button>
            </div>
        )
    }

    componentDidUpdate() {
        if (this.props.showActionPanel) {
            const element = this.actionPanelRef.current;
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
                element.focus();
            }
        }
    }
}

export default injectIntl(ActionPanel);
