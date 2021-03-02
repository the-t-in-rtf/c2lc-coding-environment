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
    onSelect: (value: WorldName) => void
};

type WorldSelectorState = {
    world: WorldName
}

class WorldSelector extends React.Component<WorldSelectorProps, WorldSelectorState> {
    constructor (props) {
        super(props);
        this.state = {
            world: 'default'
        }
    }

    componentDidUpdate(prevProps: WorldSelectorProps, prevState: WorldSelectorState) {
        if (this.state.world !== prevState.world) {
            this.props.onSelect(this.state.world);
        }
    }

    handleCharacterClick = (event: Event, worldName: WorldName) => {
        event.preventDefault();
        this.setState({ world: worldName });
    }

    handleCharacterKeyDown = (event: KeyboardEvent, worldName: WorldName) => {
        const toggleKeys = [' ', 'Enter'];

        if (toggleKeys.indexOf(event.key) !== -1) {
            event.preventDefault();
            this.setState({ world: worldName });
        }
    }

    render() {
        return (
            <div className='WorldSelector'>
                <HeaderIcon
                    className="HeaderIcon"
                />
                <RobotIcon
                    className={"WorldIcon" + (this.state.world === 'default' ? " WorldIcon--selected" : "") }
                    onClick={(e: Event) => { this.handleCharacterClick(e, 'default')}}
                    onKeyDown={(e: KeyboardEvent) => { this.handleCharacterKeyDown(e, 'default')}}
                    tabIndex={0}
                />
                <RabbitIcon
                    className={"WorldIcon" + (this.state.world === 'forest' ? " WorldIcon--selected" : "") }
                    onClick={(e: Event) => { this.handleCharacterClick(e, 'forest')}}
                    onKeyDown={(e: KeyboardEvent) => { this.handleCharacterKeyDown(e, 'forest')}}
                    tabIndex={0}
                />
                <SpaceShipIcon
                    className={"WorldIcon" + (this.state.world === 'space' ? " WorldIcon--selected" : "") }
                    onClick={(e: Event) => { this.handleCharacterClick(e, 'space')}}
                    onKeyDown={(e: KeyboardEvent) => { this.handleCharacterKeyDown(e, 'space')}}
                    tabIndex={0}
                />
            </div>
        );
    }
}

export default injectIntl(WorldSelector);
