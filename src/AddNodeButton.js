// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import {injectIntl} from 'react-intl';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import './AddNodeButton.scss';

type AddNodeButtonProps = {
    commandSelected: ?boolean,
    showButton: boolean,
    programStepNumber: number,
    intl: any,
    onDrop: (e: SyntheticDragEvent<HTMLButtonElement>) => void,
    onClick: (e: SyntheticEvent<HTMLButtonElement>) => void
};

type AddNodeButtonState = {
    showNode: boolean
}

class AddNodeButton extends React.Component<AddNodeButtonProps, AddNodeButtonState> {
    ref: any;

    constructor(props: AddNodeButtonProps) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            showNode: false
        }
    }

    handleDragOver = (e: SyntheticDragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (this.state.showNode === false) {
            this.setState({
                showNode: true
            });
        }
    }

    handleFocus = () => {
        this.setState({
            showNode: true
        });
    }

    handleBlur = () => {
        if (!this.props.showButton) {
            this.setState({
                showNode: false
            });
        }
    }

    // $FlowFixMe
    render() {
        if (this.props.showButton || this.state.showNode) {
            return(
                <Button
                    ref={this.ref}
                    className='AddNodeButton__plus-button'
                    id={`programBlock-${this.props.programStepNumber}`}
                    data-stepnumber={this.props.programStepNumber}
                    onClick={this.props.onClick}
                    onBlur={this.handleBlur}
                    onDrop={this.props.onDrop}
                    onDragOver={this.handleDragOver}>
                    <AddIcon className='AddNodeButton__plus-button-svg' />
                </Button>
            )
        } else if (!this.props.showButton) {
            return(
                <div
                    className='AddNodeButton__plus-button--minimize'
                    id={`programBlock-${this.props.programStepNumber}`}
                    tabIndex={
                        this.props.commandSelected ?
                        '0' :
                        '-1'}
                    onFocus={this.handleFocus}
                    onDragOver={
                        this.props.commandSelected ?
                            this.handleDragOver :
                            undefined
                    }
                />
            )
        }
    }

    componentDidUpdate(prevProps: {}, prevState: AddNodeButtonState) {
        if (this.state.showNode !== prevState.showNode) {
            if (this.state.showNode) {
                this.ref.current.focus();
            }
        }
    }
}

export default injectIntl(AddNodeButton);
