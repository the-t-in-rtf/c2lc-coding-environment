// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';

import { ReactComponent as EllipsisIcon } from './svg/Ellipsis.svg';

import './ActionsMenuToggle.scss';

type ActionsMenuToggleProps = {
    intl: IntlShape,
    editingDisabled: boolean,
    onClick: () => void
};

class ActionsMenuToggle extends React.Component<ActionsMenuToggleProps, {}> {
    render() {
        return (
            <div
                aria-label={this.props.intl.formatMessage({id:'ActionsMenu.toggleActionsMenu'})}
                className='ActionsMenu__toggle-button'
                disabled={this.props.editingDisabled}
                onClick={this.props.onClick}
            >
                <EllipsisIcon className='ActionsMenu__toggle-button-svg'/>
            </div>
        );
    }
};

export default injectIntl(ActionsMenuToggle);
