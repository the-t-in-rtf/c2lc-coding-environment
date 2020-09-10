// @flow

import * as React from 'react';
import { Nav, Tab } from 'react-bootstrap';

type CommandPaletteProps = {
    children?: React.Node,
    defaultActiveKey: string,
    id: string
};

export default class CommandPalette extends React.Component<CommandPaletteProps, {}> {
    render() {
        return (
            // $FlowFixMe: The flow-typed definitions for react-boostrap introduce a type-checking error here.
            <Tab.Container id={this.props.id} defaultActiveKey={this.props.defaultActiveKey}>
                <Nav variant='tabs'>
                    {React.Children.map(this.props.children, (category)=>{
                        return (
                            // $FlowFixMe: The flow-typed definitions for react-boostrap introduce a type-checking error here.
                            <Nav.Item>
                                { /* $FlowFixMe: The flow-typed definitions for react-boostrap introduce a type-checking error here. */ }{}
                                <Nav.Link eventKey={category.props.eventKey}>{category.props.title}</Nav.Link>
                            </Nav.Item>
                        );
                    })}
                </Nav>
                { /* $FlowFixMe: The flow-typed definitions for react-boostrap introduce a type-checking error here. */ }
                <Tab.Content>
                    {this.props.children}
                </Tab.Content>
            </Tab.Container>
        );
    }
}
