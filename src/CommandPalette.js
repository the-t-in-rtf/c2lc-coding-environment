// @flow

import { Button, Col, Image, Row, Tabs, Tab } from 'react-bootstrap';
import type {Program} from './types';
import React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import soundEffectIcon from 'material-design-icons/av/svg/production/ic_volume_up_48px.svg';
import loopIcon from 'material-design-icons/av/svg/production/ic_loop_48px.svg';

const iconTable = {
    movements_0 : arrowUp,
    movements_1 : arrowLeft,
    movements_2 : arrowRight,
    sounds_0 : soundEffectIcon,
    sounds_1 : soundEffectIcon,
    sounds_2 : soundEffectIcon,
    programs_0 : loopIcon
}

type CommandPaletteProps = {
    program: Program,
    programVer: number,
    onChange: (string) => void,
    selectedCommand: (string) => void
};

type CommandPaletteState = {
    programType: string,
    activeState: any
};

export default class CommandPalette extends React.Component<CommandPaletteProps, CommandPaletteState> {
    counter: number;
    constructor(props: CommandPaletteProps) {
        super(props);
        this.state = {
            programType: 'movements',
            activeState: 
            {
                forward: false,
                left: false,
                right: false
            }
        }
    }

    handleSelectProgram = (stateName: string) => {
        let previousStates = {};
        if (this.state.activeState[stateName]) {
            this.props.onChange(stateName);
            this.props.selectedCommand('none');
        } else {
            this.props.selectedCommand(stateName);
        }
        for (const state of Object.keys(this.state.activeState)) {
            if (state !== stateName) {
                previousStates[state] = false;
            }
        }
        previousStates[stateName] = !this.state.activeState[stateName];
        const newActiveState = Object.assign(this.state.activeState, previousStates);
        this.setState((state) => {
            return newActiveState;
        })
    }

    handleChangeProgramType = (type: string) => {
        this.setState({
            programType : type
        });
    }

    componentDidUpdate(prevProps: {}, prevState: CommandPaletteState) {
        if (this.state.programType !== prevState.programType) {
            switch(this.state.programType) {
                case 'movements' : this.setState((state) => {return {activeState: {forward:false, left:false, right:false}}});
                                    break;
                case 'sounds' : this.setState((state) => {return {activeState: {sound1:false, sound2:false, sound3:false}}});
                                    break;
                case 'programs' : this.setState((state) => {return {activeState: {loop: false}}});
                                    break;
                default: break; 
            }
        }
    }

    


    render() {
        return (
                <Tabs defaultActiveKey="movements" id="commandPalette" onSelect={(event)=> {this.handleChangeProgramType(event)}}>
                    <Tab eventKey="movements" title="Movements">
                        <Row className='justify-content-start'>
                            {Object.keys(this.state.activeState).map((item, programNum)=> {
                                return (
                                    <Col key={`${this.state.programType}_${programNum}`}>
                                        <Button 
                                            variant={this.state.activeState[item] ? 'outline-primary' : 'light'} 
                                            aria-label={this.state.activeState[item] ? `${item} activated` : `${item} inactive`} 
                                            onClick={() => {this.handleSelectProgram(item)}}>
                                            <Image src={iconTable[`${this.state.programType}_${programNum}`]} />
                                        </Button>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Tab>
                    <Tab eventKey="sounds" title="Sounds">
                        <Row className='justify-content-start'>
                            {Object.keys(this.state.activeState).map((item, programNum)=> {
                                return (
                                    <Col key={`${this.state.programType}_${programNum}`}>
                                        <Button 
                                            variant={this.state.activeState[item] ? 'outline-primary' : 'light'} 
                                            aria-label={this.state.activeState[item] ? `${item} activated` : `${item} inactive`} 
                                            onClick={() => {this.handleSelectProgram(item)}}>
                                            <Image src={iconTable[`${this.state.programType}_${programNum}`]} />
                                        </Button>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Tab>
                    <Tab eventKey="programs" title="Programs">
                        <Row className='justify-content-start'>
                            {Object.keys(this.state.activeState).map((item, programNum)=> {
                                return (
                                    <Col key={`${this.state.programType}_${programNum}`}>
                                        <Button 
                                            variant={this.state.activeState[item] ? 'outline-primary' : 'light'} 
                                            aria-label={this.state.activeState[item] ? `${item} activated` : `${item} inactive`} 
                                            onClick={() => {this.handleSelectProgram(item)}}>
                                            <Image src={iconTable[`${this.state.programType}_${programNum}`]} />
                                        </Button>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Tab>
                </Tabs>
        );
    }
}
