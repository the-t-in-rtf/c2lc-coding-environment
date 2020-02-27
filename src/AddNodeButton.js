// @flow

import React, { useState, useEffect } from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import './AddNodeButton.scss';

type AddNodeButtonProps = {
    commandSelected: ?boolean,
    disabled: boolean,
    showButton: boolean,
    programStepNumber: number,
    onDrop: (e: SyntheticDragEvent<HTMLButtonElement>) => void,
    onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
    onFocus: (stepNumber: number) => void
};

const AddNodeButton = React.forwardRef<AddNodeButtonProps, any>(
    (props, ref) => {
        const {
            commandSelected,
            disabled,
            showButton,
            programStepNumber,
            onDrop,
            onClick,
            onFocus
        } = props;

        const [showNode, setShowNode] = useState(false);

        useEffect(() => {
            if (showNode) {
                onFocus(programStepNumber);
            }
        }, [showNode, onFocus, programStepNumber]);

        const handleDragOver = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (showNode === false) {
                setShowNode(true);
            }
        }

        const handleFocus = () => {
            setShowNode(true);
            console.log('is on focus');
        }

        const handleBlur = () => {
            if (!showButton) {
                setShowNode(false);
            }
        }

        if (showButton || showNode) {
            return React.createElement(
                AriaDisablingButton,
                {
                    'onClick': onClick,
                    'disabled': disabled,
                    'className': 'AddNodeButton__plus-button',
                    'ref': ref,
                    'id': `programBlock-${programStepNumber}`,
                    'data-stepnumber': programStepNumber,
                    'onBlur': handleBlur,
                    'onDrop': onDrop,
                    'onDragOver': handleDragOver
                },
                <AddIcon className='AddNodeButton__plus-button-svg' />
            );
        } else if (!showButton) {
            return (
                <div
                    className='AddNodeButton__background'
                    onDragOver={
                        commandSelected ?
                            handleDragOver :
                            undefined
                    }
                >
                    <div
                        className='AddNodeButton__plus-button--minimize'
                        id={`programBlock-${programStepNumber}`}
                        tabIndex={
                            commandSelected ?
                            '0' :
                            '-1'}
                        onFocus={handleFocus}
                        onDragOver={
                            commandSelected ?
                                handleDragOver :
                                undefined
                        }
                    />
                </div>
            )
        }
    }
);

export default AddNodeButton;
