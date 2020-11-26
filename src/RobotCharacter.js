// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import { ReactComponent as SpaceShipIcon } from './svg/SpaceShip.svg';
import { ReactComponent as RabbitIcon } from './svg/Rabbit.svg';
import './RobotCharacter.scss';

type RobotCharacterProps = {
    theme: string,
    transform: string,
    width: number
};

export default class RobotCharacter extends React.Component<RobotCharacterProps, {}> {
    getThemedCharacter = () => {
        if (this.props.theme === 'space') {
            return (
                <SpaceShipIcon
                    className='RobotCharacter__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        } else if (this.props.theme === 'forest') {
            return (
                <RabbitIcon
                    className='RobotCharacter__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        } else {
            return (
                <RobotIcon
                    className='RobotCharacter__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        }
    }

    render() {
        return (
            <g
                className='RobotCharacter'
                transform={this.props.transform}>
                {this.getThemedCharacter()}
            </g>
        );
    }
}
