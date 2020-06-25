// @flow

import React from 'react';
import { injectIntl } from 'react-intl';
import './ToggleSwitch.scss';

type ToggleSwitchProps = {
    intl: any,
    ariaLabelId: string,
    toggleState: boolean,
    onChange: () => void
};

class ToggleSwitch extends React.Component<ToggleSwitchProps, {}> {
    handleClick = () => {
        this.toggleStateChange();
    }

    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const spaceKey = ' ';
        if (e.key === spaceKey) {
            e.preventDefault();
            this.toggleStateChange();
        }
    }

    toggleStateChange() {
        this.props.onChange();
    }

    render() {
        return (
            <div
                className= {
                    this.props.toggleState ?
                    'ToggleSwitch ToggleSwitch--checked' :
                    'ToggleSwitch'
                }
                role='switch'
                aria-label={this.props.intl.formatMessage({id: `ToggleSwitch.${this.props.ariaLabelId}`})}
                aria-checked={this.props.toggleState}
                tabIndex='0'
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}>
                <div className='ToggleSwitch__switch-inner-circle' />
            </div>
        )
    }
}

export default injectIntl(ToggleSwitch);
