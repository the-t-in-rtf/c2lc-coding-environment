// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as AudioOnIcon } from './svg/AudioOn.svg';
import { ReactComponent as AudioOffIcon } from './svg/AudioOff.svg';

type AudioFeedbackToggleSwitchProps = {
    intl: any,
    value: boolean,
    onChange: (value: boolean) => void
};

class AudioFeedbackToggleSwitch extends React.Component<AudioFeedbackToggleSwitchProps, {}> {
    render() {
        return (
            <ToggleSwitch
                ariaLabel={this.props.intl.formatMessage({id: 'AudioFeedbackToggleSwitch.audioFeedback'})}
                value={this.props.value}
                contentsTrue={<AudioOnIcon />}
                contentsFalse={<AudioOffIcon />}
                onChange={this.props.onChange} />
        );
    }
};

export default injectIntl(AudioFeedbackToggleSwitch);
