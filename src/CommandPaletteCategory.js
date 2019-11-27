// @flow

import * as React from 'react';
import { Tab } from 'react-bootstrap';

type CommandPaletteCategoryProps = {
    children?: React.Node,
    eventKey: string,
    title: string
};

export default class CommandPaletteCategory extends React.Component<CommandPaletteCategoryProps, {}> {
    render() {
        return (
            <Tab.Pane eventKey={this.props.eventKey} title={this.props.title}>
                {this.props.children}
            </Tab.Pane>
        );
    }
};
