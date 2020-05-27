// @flow

import React from 'react';
import { injectIntl } from 'react-intl';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import './AddNodeToggleSwitch.scss';

type AddNodeToggleSwitchProps = {
    intl: any,
    isAddNodeExpandedMode: boolean,
    onClick: () => void,
    onKeyDown: (e: SyntheticKeyboardEvent<HTMLInputElement>) => void
};

class AddNodeToggleSwitch extends React.Component<AddNodeToggleSwitchProps, {}> {
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
                onClick={this.props.onClick}
                onKeyDown={this.props.onKeyDown}>
                <div className='AddNodeToggleSwitch__switch-inner-circle'>
                    <AddIcon />
                </div>
            </div>
        )
    }
}

export default injectIntl(AddNodeToggleSwitch);
