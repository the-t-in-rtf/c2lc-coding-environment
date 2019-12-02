// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import {injectIntl} from 'react-intl';
import './CommandPaletteCommand.css';

type CommandPaletteCommandProps = {
    commandName: string,
    backgroundColor: string,
    icon: any,
    intl: any,
    selectedCommandName: ?string,
    onChange: (commandName: ?string) => void
};

class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        this.props.onChange(
            this.props.commandName === this.props.selectedCommandName ? null : this.props.commandName
        );
    };

    render() {
        return (
            <>
                <style type="text/css">
                    {`
                    .CommandPaletteCommand__command-button.${this.props.commandName} {
                        background-color: ${this.props.backgroundColor};
                    }
                    `}
                </style>
                <Button
                    className={`CommandPaletteCommand__command-button ${this.props.commandName}`}
                    variant={this.props.commandName === this.props.selectedCommandName ? 'outline-primary' : 'light'}
                    aria-label={this.props.intl.formatMessage({ id: `CommandPaletteCommand.${this.props.commandName}`})}
                    aria-pressed={this.props.commandName === this.props.selectedCommandName ? 'true' : 'false'}
                    onClick={this.handleClick}>
                    {this.props.icon}
                </Button>
            </>
        )
    }
}

export default injectIntl(CommandPaletteCommand);
