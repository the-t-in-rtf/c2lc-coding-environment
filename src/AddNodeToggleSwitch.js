// @flow

import React from 'react';
import { injectIntl } from 'react-intl';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import './AddNodeToggleSwitch.scss';

type AddNodeToggleSwitchProps = {
    intl: any,
    isAddNodeExpandedMode: boolean,
    onChange: (isAddNodeExpandedMode: boolean) => void
};

class AddNodeToggleSwitch extends React.Component<AddNodeToggleSwitchProps, {}> {
    handleClick = () => {
        this.toggleAddNodeExpandedMode();
    }

    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const spaceKey = ' ';
        if (e.key === spaceKey) {
            e.preventDefault();
            this.toggleAddNodeExpandedMode();
        }
    }

    toggleAddNodeExpandedMode() {
        this.props.onChange(!this.props.isAddNodeExpandedMode);
    }

    render() {
        return (
            <div
                className= {
                    this.props.isAddNodeExpandedMode ?
                    'AddNodeToggleSwitch AddNodeToggleSwitch--checked' :
                    'AddNodeToggleSwitch'
                }
                role='switch'
                aria-label={this.props.intl.formatMessage({id:'AddNodeToggleSwitch.toggleAddNodeExpandMode'})}
                aria-checked={this.props.isAddNodeExpandedMode}
                tabIndex='0'
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}>
                <div className='AddNodeToggleSwitch__switch-inner-circle'>
                    <AddIcon />
                </div>
            </div>
        )
    }
}

export default injectIntl(AddNodeToggleSwitch);
