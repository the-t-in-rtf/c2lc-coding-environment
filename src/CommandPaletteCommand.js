// @flow

import React from 'react';
import { Button, Col, Image } from 'react-bootstrap';

type CommandPaletteCommandProps = {
    commandName: string,
    icon: any,
    selectedCommandName: ?string,
    onChange: (commandName: ?string) => void
};

export default class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        this.props.onChange(
            this.props.commandName === this.props.selectedCommandName ? null : this.props.commandName
        );
    }

    render() {
        return (
            <Col>
                <Button
                    variant={this.props.commandName === this.props.selectedCommandName ? 'outline-primary' : 'light'}
                    //aria-label={this.state.selected ? `${} activated` : `${item} inactive`}
                    onClick={this.handleClick}>
                    <Image src={this.props.icon}/>
                </Button>
            </Col>
        )
    }
}
