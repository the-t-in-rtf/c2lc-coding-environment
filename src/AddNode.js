// @flow

import React, { useState } from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import classNames from 'classnames';
import './AddNode.scss';

type AddNodeProps = {
    isDraggingCommand: ?boolean,
    disabled: boolean,
    expandedMode: boolean,
    programStepNumber: number,
    onDrop: (e: SyntheticDragEvent<HTMLButtonElement>) => void,
    onClick: (e: SyntheticEvent<HTMLButtonElement>) => void
};

const AddNode = React.forwardRef<AddNodeProps, any>(
    // $FlowFixMe
    (props, ref) => {
        const {
            isDraggingCommand,
            disabled,
            expandedMode,
            programStepNumber,
            onDrop,
            onClick,
            ...otherProps
        } = props;

        const [isDragOver, setIsDragOver] = useState(false);

        const handleDragOver = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsDragOver(true);
        }

        const handleDrop = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            onDrop(e);
            setIsDragOver(false);
        }

        const handleDragLeave = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsDragOver(false);
        }

        if (expandedMode || isDragOver) {
            const addNodeClasses = classNames(
                isDragOver && 'AddNode--drag-over'
            );

            let button = React.createElement(
                AriaDisablingButton,
                Object.assign({
                    'onClick': onClick,
                    'disabled': disabled,
                    'className': 'AddNode__expanded-button',
                    'ref': ref,
                    'data-stepnumber': programStepNumber
                }, otherProps),
                <AddIcon />
            );

            return (
                <div className={addNodeClasses}>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__expanded-drop-area'
                            data-stepnumber={programStepNumber}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    </div>
                    {button}
                </div>
            )
        } else {
            return (
                <div>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__collapsed-drop-area'
                            onDragOver={
                                isDraggingCommand ?
                                    handleDragOver :
                                    undefined
                            }
                        >
                        </div>
                    </div>
                    <div className='AddNode__collapsed-icon'>
                        <AddIcon />
                    </div>
                </div>
            )
        }
    }
);

export default AddNode;
