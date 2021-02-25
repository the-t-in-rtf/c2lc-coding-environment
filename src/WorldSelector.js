// @flow

import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import type { WorldName } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import './WorldSelector.scss';

type ThemeSelectorProps = {
    intl: IntlShape,
    onSelect: (value: WorldName) => void
};

class ThemeSelector extends React.Component<ThemeSelectorProps, {}> {
    render() {
        return (
            <DropdownButton className='WorldSelector' onSelect={this.props.onSelect} title={`${this.props.intl.formatMessage({id:'WorldSelector.world'})}`}>
                {
                    /* $FlowFixMe
                        Cannot get Dropdown.Item because property Item is missing in statics of Dropdown
                    */
                    <Dropdown.Item eventKey='default'>{this.props.intl.formatMessage({id:'WorldSelector.world.default'})}</Dropdown.Item>
                }
                { // $FlowFixMe
                    <Dropdown.Item eventKey='space'>{this.props.intl.formatMessage({id:'WorldSelector.world.space'})}</Dropdown.Item>
                }
                { // $FlowFixMe
                    <Dropdown.Item eventKey='forest'>{this.props.intl.formatMessage({id:'WorldSelector.world.forest'})}</Dropdown.Item>
                }
            </DropdownButton>
        );
    }
}

export default injectIntl(ThemeSelector);
