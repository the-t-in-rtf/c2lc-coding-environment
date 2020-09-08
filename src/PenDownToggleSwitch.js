// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as PenDownIcon } from './svg/PenDown.svg';
import './PenDownToggleSwitch.scss';

type PenDownToggleSwitchProps = {
    intl: any,
    value: boolean,
    onChange: (value: boolean) => void
};

class PenDownToggleSwitch extends React.Component<PenDownToggleSwitchProps, {}> {
    render() {
        return (
            <ToggleSwitch
                ariaLabel={this.props.intl.formatMessage({id: 'PenDownToggleSwitch.penDown'})}
                value={this.props.value}
                contentsTrue={<PenDownIcon />}
                contentsFalse={<PenDownIcon />}
                onChange={this.props.onChange}
                className='PenDownToggleSwitch'/>
        );
    }
};

export default injectIntl(PenDownToggleSwitch);
