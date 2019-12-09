// @flow

import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as ErrorIcon } from './svg/Error.svg';
import './DashConnectionErrorModal.css';

type DashConnectionErrorModalProps = {
    intl: any,
    show: boolean,
    onCancel: () => void,
    onRetry: () => void
};

class DashConnectionErrorModal extends React.Component<DashConnectionErrorModalProps, {}> {
    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onCancel}
                size='lg'
                aria-labelledby="contained-modal-title-vcenter"
                dialogClassName="DashConnectionErrorModal-container">
                <Modal.Body>
                    <Col>
                        <Row>
                            <span role='img' aria-label={this.props.intl.formatMessage({id:'DashConnectionErrorModal.error'})} >
                                <ErrorIcon className='DashConnectionErrorModal-error-svg' />
                            </span>
                            <FormattedMessage id='DashConnectionErrorModal.title' />
                        </Row>
                        <Row>
                            <ul>
                                <li>
                                    <FormattedMessage id='DashConnectionErrorModal.firstMessage' />
                                </li>
                                <li>
                                    <FormattedMessage id='DashConnectionErrorModal.secondMessage' />
                                </li>
                            </ul>
                        </Row>
                        <Row className='DashConnectionErrorModal__option-buttons'>
                            <Button
                                className='DashConnectionErrorModal__option-button'
                                variant='light'
                                onClick={this.props.onCancel}>
                                <FormattedMessage id='DashConnectionErrorModal.cancelButton' />
                            </Button>
                            <Button
                                className='DashConnectionErrorModal__option-button'
                                variant='light'
                                onClick={this.props.onRetry}>
                                <FormattedMessage id='DashConnectionErrorModal.retryButton' />
                            </Button>
                        </Row>
                    </Col>
                </Modal.Body>
            </Modal>
        );
    }
}

export default injectIntl(DashConnectionErrorModal);
