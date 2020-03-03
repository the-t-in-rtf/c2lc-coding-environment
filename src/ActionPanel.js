// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import {injectIntl} from 'react-intl';
import './ActionPanel.scss';

type ActionPanelProps = {
    showActionPanel: boolean,
    position: {
        top: number,
        left: number
    },
    intl: any
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    actionPanelRef: { current: null | HTMLDivElement };
    constructor(props) {
        super(props);
        this.actionPanelRef = React.createRef();
    }

    render() {
        const positionStyles = {
            position: 'absolute',
            top: this.props.position.top - 150,
            left: this.props.position.left
        }
        return (
            <div className={
                this.props.showActionPanel ?
                'ActionPanel__panel' :
                'ActionPanel__panel--hidden'}
                style={positionStyles}
                ref={this.actionPanelRef}>
                <Button className='ActionPanel__action-buttons'/>
                <Button className='ActionPanel__action-buttons'/>
                <Button className='ActionPanel__action-buttons'/>
                <Button className='ActionPanel__action-buttons'/>
            </div>
        )
    }

    componentDidUpdate() {
        if (this.props.showActionPanel) {
            let element = this.actionPanelRef.current;
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
        }
    }
}

export default injectIntl(ActionPanel);
