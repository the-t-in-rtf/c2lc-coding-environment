// @flow

import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as ErrorIcon } from './svg/Error.svg';
import './ConnectionErrorModal.css';

type ConnectionErrorModalProps = {
    intl: any,
    show: boolean,
    onCancel: () => void,
    onRetry: () => void
};

class ConnectionErrorModal extends React.Component<ConnectionErrorModalProps, {}> {
    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onCancel}
                size='lg'
                aria-labelledby="contained-modal-title-vcenter"
                dialogClassName="ConnectionErrorModal-container">
                <Modal.Body>
                    <Col>
                        <Row>
                            <span role='img' aria-label={this.props.intl.formatMessage({id:'ConnectionErrorModal.error'})} >
                                <ErrorIcon className='ConnectionErrorModal-error-svg' />
                            </span>
                            <FormattedMessage id='ConnectionErrorModal.title' />
                        </Row>
                        <Row>
                            <ul>
                                <li>
                                    <FormattedMessage id='ConnectionErrorModal.firstMessage' />
                                </li>
                                <li>
                                    <FormattedMessage id='ConnectionErrorModal.secondMessage' />
                                </li>
                            </ul>
                        </Row>
                        <Row className='ConnectionErrorModal__option-buttons'>
                            <Button
                                className='ConnectionErrorModal__option-button'
                                variant='light'
                                onClick={this.props.onCancel}>
                                <FormattedMessage id='ConnectionErrorModal.cancelButton' />
                            </Button>
                            <Button
                                className='ConnectionErrorModal__option-button'
                                variant='light'
                                onClick={this.props.onRetry}>
                                <FormattedMessage id='ConnectionErrorModal.retryButton' />
                            </Button>
                        </Row>
                    </Col>
                </Modal.Body>
            </Modal>
        );
    }
}

export default injectIntl(ConnectionErrorModal);
