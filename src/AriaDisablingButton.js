// @flow

import * as React from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

type AriaDisablingButtonProps = {
    onClick: (evt: any) => void,
    disabled: boolean,
    className?: string,
    disabledClassName: string,
    children?: React.Node
};

const AriaDisablingButton = React.forwardRef<AriaDisablingButtonProps, Button>(
    (props, ref) => {
        const {
            onClick,
            disabled,
            className,
            disabledClassName,
            children,
            ...otherProps
        } = props;

        const classes = classNames(
            className,
            disabled && disabledClassName
        );

        return React.createElement(
            Button,
            Object.assign({
                'onClick': disabled ? undefined : onClick,
                'aria-disabled': disabled,
                'className': classes,
                'ref': ref
            }, otherProps),
            children
        );
    }
);

export default AriaDisablingButton;
