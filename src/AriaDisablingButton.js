import * as React from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

const AriaDisablingButton = React.forwardRef(
    ({onClick, disabled, className, disabledClassName, children, ...props}, ref) => {
        const classes = classNames(
            className,
            disabled && disabledClassName
        );

        if (ref) {
            props.ref = ref;
        }

        return (
            <Button
                onClick={disabled ? undefined : onClick}
                aria-disabled={disabled}
                className={classes}
                {...props}>
                {children}
            </Button>
        )
    }
)

export default AriaDisablingButton;
