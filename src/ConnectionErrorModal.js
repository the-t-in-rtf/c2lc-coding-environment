// @flow

import React from 'react';
import { Button, Col, Image, Modal, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import errorIcon from './svg/Error.svg';
import './ConnectionErrorModal.css';

type ConnectionErrorModalProps = {
    show: boolean,
    onCancel: () => void,
    onRetry: () => void
};

export default class ConnectionErrorModal extends React.Component<ConnectionErrorModalProps, {}> {
    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onCancel}
                size='lg'
                aria-labelledby="contained-modal-title-vcenter"
                dialogClassName="ConnectionErrorModal-container"
                centered>
                <Modal.Body>
                    <Col>
                        <Row>
                            <Image className='ConnectionErrorModal-error-svg' src={errorIcon} />
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
