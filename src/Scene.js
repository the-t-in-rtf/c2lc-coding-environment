// @flow

import React from 'react';
import * as C2lcMath from './C2lcMath';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import { sceneMinX, sceneMinY, sceneWidth, sceneHeight } from './Scene.scss';
import './Scene.scss';

type SceneProps = {
    intl: any
};

type SceneState = {
    location: {
        x: number,
        y: number
    },
    directionDegrees: number
};

class Scene extends React.Component<SceneProps, SceneState> {
    constructor(props: SceneProps) {
        super(props);
        this.state = {
            location: {
                x: 0,
                y: 0
            },
            directionDegrees: 90 // 0 is North, 90 is East
        }
    }

    forward(distance: number): Promise<void> {
        this.setState((state) => {
            const directionRadians = C2lcMath.degrees2radians(state.directionDegrees);
            const xOffset = Math.sin(directionRadians) * distance;
            const yOffset = Math.cos(directionRadians) * distance;

            const newX = state.location.x + xOffset;
            const newY = state.location.y - yOffset;

            return {
                location: {
                    x: newX,
                    y: newY
                }
            }
        });

        return Promise.resolve();
    }

    turnLeft(amountDegrees: number): Promise<void> {
        this.setState((state) => {
            return {
                directionDegrees: C2lcMath.wrap(0, 360,
                    state.directionDegrees - amountDegrees)
            };
        });

        return Promise.resolve();
    }

    turnRight(amountDegrees: number): Promise<void> {
        this.setState((state) => {
            return {
                directionDegrees: C2lcMath.wrap(0, 360,
                    state.directionDegrees + amountDegrees)
            };
        });

        return Promise.resolve();
    }

    render() {
        // Subtract 90 degrees from the character bearing as the character image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.state.location.x} ${this.state.location.y}) rotate(${this.state.directionDegrees - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage({id: 'Scene'})}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${sceneMinX} ${sceneMinY} ${sceneWidth} ${sceneHeight}`}>
                        <RobotCharacter robotCharacterTransform={robotCharacterTransform}/>
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene, { forwardRef: true });
