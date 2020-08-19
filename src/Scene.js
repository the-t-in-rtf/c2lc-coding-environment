// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import './Scene.scss';

type SceneProps = {
    intl: any,
    numRows: number,
    numColumns: number,
    gridCellWidth: number,
    characterState: CharacterState
};

class Scene extends React.Component<SceneProps, {}> {

    drawGrid(numRow: number, numColumn: number, width: number, minX: number, minY: number) {
        const grid = [];
        let xOffset = minX;
        let yOffset = minY;
        for (let i=1;i < numRow + 1;i++) {
            yOffset = yOffset + width;
            if (i < numRow) {
            grid.push(<line
                className='Scene__grid-line'
                key={`grid-cell-row-${i}`}
                x1={`${xOffset}`}
                y1={`${yOffset}`}
                x2={`${-xOffset}`}
                y2={`${yOffset}`} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    textAnchor='end'
                    key={`grid-cell-label-${i}`}
                    dominantBaseline='middle'
                    x={`${xOffset * 1.05}`}
                    y={`${yOffset - width / 2}`}>
                    {i}
                </text>
            )
        }
        xOffset = minX;
        yOffset = minY;
        for (let i=1;i < numColumn + 1;i++) {
            xOffset = xOffset + width;
            if (i < numColumn) {
            grid.push(<line
                className='Scene__grid-line'
                key={`grid-cell-column-${i}`}
                x1={`${xOffset}`}
                y1={`${yOffset}`}
                x2={`${xOffset}`}
                y2={`${-yOffset}`} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    key={`grid-cell-label-${String.fromCharCode(64+i)}`}
                    textAnchor='middle'
                    x={`${xOffset - width / 2}`}
                    y={`${yOffset * 1.05}`}>
                    {String.fromCharCode(64+i)}
                </text>
            )
        }
        return grid;
    }

    render() {
        const width = this.props.numColumns * this.props.gridCellWidth;
        const height = this.props.numRows * this.props.gridCellWidth;
        const minX = -width / 2;
        const minY = -height / 2;

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.directionDegrees - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage({id: 'Scene'})}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${minX} ${minY} ${width} ${height}`}>
                        <defs>
                            <clipPath id='Scene'>
                                <rect x={minX} y={minY} width={width} height={height} />
                            </clipPath>
                        </defs>
                        {this.drawGrid(this.props.numRows, this.props.numColumns, this.props.gridCellWidth, minX, minY)}
                        <RobotCharacter
                            robotCharacterTransform={robotCharacterTransform}
                            width={this.props.gridCellWidth * 0.8}
                        />
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene);
