// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import ShareCompleteModal from './ShareCompleteModal';

type ShareButtonProps = {
    intl: IntlShape,
    disabled: boolean
};

type ShareButtonState = {
    showShareComplete: boolean
}

class ShareButton extends React.Component<ShareButtonProps, ShareButtonState> {
    static defaultProps = {
        disabled: false,
        showShareComplete: false
    }

    constructor (props: ShareButtonProps) {
        super(props);
        this.state = {
            showShareComplete: false
        }
    }

    handleClickShareButton = () => {
        // Get the current URL, which represents the current program state.
        const currentUrl = document.location.href;

        // Copy the URL to the clipboard, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
        navigator.clipboard.writeText(currentUrl).then(() => {
            // TODO: Display modal.
            this.setState({ showShareComplete: true})
        });
    }

    handleModalClose = () => {
        this.setState({showShareComplete: false});
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    variant="dark"
                    className='ShareButton'
                    disabled={this.props.disabled}
                    onClick={this.handleClickShareButton}
                >
                    {this.props.intl.formatMessage({id:'ShareButton'})}
                </Button>
                <ShareCompleteModal
                    show={this.state.showShareComplete}
                    onHide={this.handleModalClose}
                />
            </React.Fragment>
        );
    }
}

export default injectIntl(ShareButton);

