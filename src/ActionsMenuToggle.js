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
    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.onClick();
        }
    }

    render() {
        return (
            <div
                aria-label={this.props.intl.formatMessage({id:'ActionsMenu.toggleActionsMenu'})}
                tabIndex='0'
                className='ActionsMenu__toggle-button'
                disabled={this.props.editingDisabled}
                onClick={this.props.onClick}
                onKeyDown={this.handleKeyDown}
            >
                <EllipsisIcon className='ActionsMenu__toggle-button-svg'/>
            </div>
        );
    }
};

export default injectIntl(ActionsMenuToggle);
