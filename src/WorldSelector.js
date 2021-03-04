// @flow

import React from 'react';
import type { WorldName } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';

import {ReactComponent as HeaderIcon} from './svg/SelectWorld.svg'
import {ReactComponent as RabbitIcon} from './svg/Rabbit.svg';
import {ReactComponent as RobotIcon} from './svg/Robot.svg';
import { ReactComponent as SpaceShipIcon } from './svg/SpaceShip.svg';

import './WorldSelector.scss';

type WorldSelectorProps = {
    intl: IntlShape,
    world: WorldName,
    onSelect: (value: WorldName) => void
};


class WorldSelector extends React.Component<WorldSelectorProps, {}> {
    handleCharacterClick = (event: Event, worldName: WorldName) => {
        event.preventDefault();
        this.props.onSelect(worldName);
    }

    handleCharacterKeyDown = (event: KeyboardEvent, worldName: WorldName) => {
        const toggleKeys = [' ', 'Enter'];

        if (toggleKeys.indexOf(event.key) !== -1) {
            event.preventDefault();
            this.props.onSelect(worldName);
        }
    }

    render() {
        return (
            <div className='WorldSelector'>
                <HeaderIcon
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world'})}
                    className="HeaderIcon"
                />
                <RobotIcon
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world.default'})}
                    className={"WorldIcon" + (this.props.world === 'default' ? " WorldIcon--selected" : "") }
                    onClick={(e: Event) => { this.handleCharacterClick(e, 'default')}}
                    onKeyDown={(e: KeyboardEvent) => { this.handleCharacterKeyDown(e, 'default')}}
                    tabIndex={0}
                />
                <RabbitIcon
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world.forest'})}
                    className={"WorldIcon" + (this.props.world === 'forest' ? " WorldIcon--selected" : "") }
                    onClick={(e: Event) => { this.handleCharacterClick(e, 'forest')}}
                    onKeyDown={(e: KeyboardEvent) => { this.handleCharacterKeyDown(e, 'forest')}}
                    tabIndex={0}
                />
                <SpaceShipIcon
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world.space'})}
                    className={"WorldIcon" + (this.props.world === 'space' ? " WorldIcon--selected" : "") }
                    onClick={(e: Event) => { this.handleCharacterClick(e, 'space')}}
                    onKeyDown={(e: KeyboardEvent) => { this.handleCharacterKeyDown(e, 'space')}}
                    tabIndex={0}
                />
            </div>
        );
    }
}

export default injectIntl(WorldSelector);
