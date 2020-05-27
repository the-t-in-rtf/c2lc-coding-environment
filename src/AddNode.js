// @flow

import React, { useState } from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import classNames from 'classnames';
import './AddNode.scss';

type AddNodeProps = {
    expandedMode: boolean,
    programStepNumber: number,
    disabled: boolean,
    'aria-label': string,
    isDraggingCommand: boolean,
    onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
    onDrop: (e: SyntheticDragEvent<HTMLButtonElement>) => void
};

const AddNode = React.forwardRef<AddNodeProps, HTMLDivElement>(
    (props, ref) => {
        const [isDragOver, setIsDragOver] = useState(false);

        const handleDragOver = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            if (props.isDraggingCommand) {
                e.preventDefault();
                setIsDragOver(true);
            }
        };

        const handleDrop = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            props.onDrop(e);
            setIsDragOver(false);
        };

        const handleDragLeave = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsDragOver(false);
        };

        const addNodeClasses = classNames(
            props.isDraggingCommand && 'AddNode--is-dragging-command'
        );

        if (props.expandedMode || isDragOver) {
            return (
                <div className={addNodeClasses}>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__expanded-drop-area'
                            data-stepnumber={props.programStepNumber}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    </div>
                    <AriaDisablingButton
                        className='AddNode__expanded-button'
                        data-stepnumber={props.programStepNumber}
                        ref={ref}
                        disabled={props.disabled}
                        aria-label={props['aria-label']}
                        onClick={props.onClick}
                    >
                        <AddIcon />
                    </AriaDisablingButton>
                </div>
            );
        } else {
            return (
                <div className={addNodeClasses}>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__collapsed-drop-area'
                            onDragOver={handleDragOver}
                        />
                    </div>
                    <div className='AddNode__collapsed-icon'>
                        <AddIcon />
                    </div>
                </div>
            );
        }
    }
);

export default AddNode;
