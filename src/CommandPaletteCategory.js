// @flow

import * as React from 'react';
import { Container, Row, Tab } from 'react-bootstrap';

type CommandPaletteCategoryProps = {
    children: React.Node,
    eventKey: string,
    title: string
};

export default class CommandPaletteCategory extends React.Component<CommandPaletteCategoryProps, {}> {
    render() {
        return (
            <Tab.Pane eventKey={this.props.eventKey} title={this.props.title}>
                <Container>
                    <Row className='justify-content-start'>
                        {this.props.children}
                    </Row>
                </Container>
            </Tab.Pane>
        );
    }
};