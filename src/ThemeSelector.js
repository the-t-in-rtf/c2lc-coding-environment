// @flow

import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import type { ThemeNames } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import './ThemeSelector.scss';

type ThemeSelectorProps = {
    intl: IntlShape,
    onSelect: (value: ThemeNames) => void
};

class ThemeSelector extends React.Component<ThemeSelectorProps, {}> {
    render() {
        return (
            <DropdownButton className='ThemeSelector' onSelect={this.props.onSelect} title={`${this.props.intl.formatMessage({id:'ThemeSelector.theme'})}`}>
                {
                    /* $FlowFixMe
                        Cannot get Dropdown.Item because property Item is missing in statics of Dropdown
                    */
                    <Dropdown.Item eventKey='default'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.default'})}</Dropdown.Item>
                }
                { // $FlowFixMe
                    <Dropdown.Item eventKey='space'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.space'})}</Dropdown.Item>
                }
                { // $FlowFixMe
                    <Dropdown.Item eventKey='forest'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.forest'})}</Dropdown.Item>
                }
            </DropdownButton>
        );
    }
}

export default injectIntl(ThemeSelector);
