// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as StopIcon } from './svg/Stop.svg';
import './StopButton.scss';

type StopButtonProps = {
    intl: IntlShape,
    disabled: boolean,
    onClick: () => void
};

class StopButton extends React.Component<StopButtonProps, {}> {
    render() {
        return (
            <AriaDisablingButton
                aria-label={`${this.props.intl.formatMessage({id:'StopButton'})}`}
                className='StopButton'
                disabledClassName='StopButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <StopIcon className='StopButton-svg' />
            </AriaDisablingButton>
        );
    }
}

export default injectIntl(StopButton);
