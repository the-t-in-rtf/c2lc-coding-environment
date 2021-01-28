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
    closestAddNodeIndex: number,
    onClick: (stepNumber: number) => void
};

const AddNode = React.forwardRef<AddNodeProps, HTMLDivElement>(
    (props, ref) => {
        const [isDragOver] = useState(false);

        const handleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
            const stepNumber = parseInt(e.currentTarget.dataset.stepnumber, 10);
            props.onClick(stepNumber);
        };

        /* istanbul ignore next */
        const addNodeClasses = classNames(
            props.isDraggingCommand && 'AddNode--is-dragging-command'
        );

        const isNearestDragNode = ( props.programStepNumber === props.closestAddNodeIndex);
        if (props.expandedMode || isNearestDragNode || (isDragOver && !props.disabled)) {
            return (
                <div className={addNodeClasses}>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__expanded-drop-area'
                            data-stepnumber={props.programStepNumber}
                        />
                    </div>
                    <AriaDisablingButton
                        className={"AddNode__expanded-button" + (isNearestDragNode ? " isDragTarget" : "")}
                        data-stepnumber={props.programStepNumber}
                        // $FlowFixMe: Use something less generic here.
                        ref={ref}
                        disabled={props.disabled}
                        aria-label={props['aria-label']}
                        onClick={handleClick}
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
                            ref={ref}
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
