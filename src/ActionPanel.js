// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import {injectIntl} from 'react-intl';
import './ActionPanel.scss';

type ActionPanelProps = {
    intl: any
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    render() {
        return (
            <div className='ActionPanel__panel'>
                <Button className='ActionPanel__action-buttons'/>
                <Button className='ActionPanel__action-buttons'/>
                <Button className='ActionPanel__action-buttons'/>
                <Button className='ActionPanel__action-buttons'/>
            </div>
        )
    }
}

export default injectIntl(ActionPanel);
