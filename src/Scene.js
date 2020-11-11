// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import SceneDimensions from './SceneDimensions';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';

import './Scene.scss';

export type SceneProps = {
    dimensions: SceneDimensions,
    characterState: CharacterState,
    intl: IntlShape
};

class Scene extends React.Component<SceneProps, {}> {
    columnLookUp: { [number]: string };
    constructor(props: SceneProps) {
        super(props);
        this.columnLookUp = this.generateColumnLookUp();
    }

    drawGrid() {
        const grid = [];
        if (this.props.dimensions.getWidth() === 0 ||
            this.props.dimensions.getHeight() === 0) {
            return grid;
        }
        const rowLabelOffset = this.props.dimensions.getWidth() * 0.025;
        const columnLabelOffset = this.props.dimensions.getHeight() * 0.025;
        const halfGridCellWidth = 0.5;
        let yOffset = this.props.dimensions.getMinY();
        for (let i=1;i < this.props.dimensions.getHeight() + 1;i++) {
            yOffset += 1;
            if (i < this.props.dimensions.getHeight()) {
                grid.push(<line
                    className='Scene__grid-line'
                    key={`grid-cell-row-${i}`}
                    x1={this.props.dimensions.getMinX()}
                    y1={yOffset}
                    x2={this.props.dimensions.getMaxX()}
                    y2={yOffset} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    textAnchor='end'
                    key={`grid-cell-label-${i}`}
                    dominantBaseline='middle'
                    x={this.props.dimensions.getMinX() - rowLabelOffset}
                    y={yOffset - halfGridCellWidth}>
                    {i}
                </text>
            )
        }
        let xOffset = this.props.dimensions.getMinX();
        for (let i=1;i < this.props.dimensions.getWidth() + 1;i++) {
            xOffset += 1;
            if (i < this.props.dimensions.getWidth()) {
                grid.push(<line
                    className='Scene__grid-line'
                    key={`grid-cell-column-${i}`}
                    x1={xOffset}
                    y1={this.props.dimensions.getMinY()}
                    x2={xOffset}
                    y2={this.props.dimensions.getMaxY()} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    key={`grid-cell-label-${String.fromCharCode(64+i)}`}
                    textAnchor='middle'
                    x={xOffset - halfGridCellWidth}
                    y={this.props.dimensions.getMinY() - columnLabelOffset}>
                    {String.fromCharCode(64+i)}
                </text>
            )
        }
        return grid;
    }

    drawCharacterPath() {
        return this.props.characterState.path.map((pathSegment, i) => {
            return <line
                className='Scene__path-line'
                key={`path-${i}`}
                x1={pathSegment.x1}
                y1={pathSegment.y1}
                x2={pathSegment.x2}
                y2={pathSegment.y2} />
        });
    }

    generateColumnLookUp() {
        const columnLookUp = {}
        for (let i=0;i<this.props.numColumns;i++) {
            columnLookUp[i-Math.floor(this.props.numColumns/2)] = String.fromCharCode(65+i);
        }
        return columnLookUp;
    getCharacterDrawXPos() {
        switch (this.props.dimensions.getBoundsStateX(this.props.characterState.xPos)) {
            case 'inBounds':
                return this.props.characterState.xPos;
            case 'outOfBoundsAbove':
                return this.props.dimensions.getMaxX() - 0.1;
            case 'outOfBoundsBelow':
                return this.props.dimensions.getMinX() + 0.1;
            default:
                throw new Error('Unexpected bounds type');
        }
    }

    getCharacterDrawYPos() {
        switch (this.props.dimensions.getBoundsStateY(this.props.characterState.yPos)) {
            case 'inBounds':
                return this.props.characterState.yPos;
            case 'outOfBoundsAbove':
                return this.props.dimensions.getMaxY() - 0.1;
            case 'outOfBoundsBelow':
                return this.props.dimensions.getMinY() + 0.1;
            default:
                throw new Error('Unexpected bounds type');
        }
    }

    render() {
        const minX = this.props.dimensions.getMinX();
        const minY = this.props.dimensions.getMinY();
        const width = this.props.dimensions.getWidth();
        const height = this.props.dimensions.getHeight();

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.getCharacterDrawXPos()} ${this.getCharacterDrawYPos()}) rotate(${this.props.characterState.getDirectionDegrees() - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage(
                        {id: 'Scene'},
                        {
                            numColumns: this.props.numColumns,
                            numRows: this.props.numRows,
                            xPos: this.columnLookUp[this.props.characterState.xPos],
                            yPos: this.props.characterState.yPos + Math.ceil(this.props.numRows/2)
                        }
                    )}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${minX} ${minY} ${width} ${height}`}>
                        <defs>
                            <clipPath id='Scene-clippath'>
                                <rect x={minX} y={minY} width={width} height={height} />
                            </clipPath>
                        </defs>
                        {this.drawGrid()}
                        <g clipPath='url(#Scene-clippath)'>
                            {this.drawCharacterPath()}
                            <RobotCharacter
                                transform={robotCharacterTransform}
                                width={0.6}
                            />
                        </g>
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene);
