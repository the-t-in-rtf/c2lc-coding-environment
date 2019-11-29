// @flow

import React from 'react';
import { injectIntl, IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Dropdown, Form, Image, Row } from 'react-bootstrap';
import CommandPalette from './CommandPalette';
import CommandPaletteCategory from './CommandPaletteCategory';
import CommandPaletteCommand from './CommandPaletteCommand';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import * as FeatureDetection from './FeatureDetection';
import Interpreter from './Interpreter';
import ProgramBlockEditor from './ProgramBlockEditor';
import type {DeviceConnectionStatus, Program, SelectedAction} from './types';
import messages from './messages.json';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import playIcon from 'material-design-icons/av/svg/production/ic_play_arrow_48px.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const localizeProperties = (fn) => React.createElement(injectIntl(({ intl }) => fn(intl)));

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string,
    dashSupport: boolean
}

type AppState = {
    program: Program,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    selectedAction: SelectedAction
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: DashDriver;
    interpreter: Interpreter;

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.state = {
            program: [
                'forward',
                'left',
                'forward',
                'left',
                'forward',
                'left',
                'forward',
                'left'
            ],
            settings: {
                language: 'en',
                dashSupport: this.appContext.bluetoothApiIsAvailable
            },
            dashConnectionStatus: 'notConnected',
            selectedAction: null
        };

        this.interpreter = new Interpreter();

        this.dashDriver = new DashDriver();
    }

    getSelectedCommandName() {
        if (this.state.selectedAction !== null
                && this.state.selectedAction.type === 'command') {
            return this.state.selectedAction.commandName;
        } else {
            return null;
        }
    }

    handleChangeProgram = (program: Program) => {
        this.setState({
            program: program
        });
    };

    handleClickRun = () => {
        if (this.state.dashConnectionStatus === 'connected') {
            this.interpreter.run(this.state.program);
        }
    };

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting'
        });
        this.dashDriver.connect().then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error) => {
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            this.setState({
                dashConnectionStatus: 'notConnected'
            });
        });
    };

    handleCommandFromCommandPalette = (command: ?string) => {
        if (command) {
            this.setState({
                selectedAction: {
                    type: 'command',
                    commandName: command
                }
            });
        } else {
            this.setState({
                selectedAction: null
            });
        }
    };

    handleSelectAction = (action: SelectedAction) => {
        this.setState({
            selectedAction: action
        });
    };

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <Container>
                    <Row className='App__mode-and-robots-section'>
                        <Col>
                            {this.state.settings.dashSupport &&
                                <DeviceConnectControl
                                        onClickConnect={this.handleClickConnectDash}
                                        connectionStatus={this.state.dashConnectionStatus}>
                                    <FormattedMessage id='App.connectToDash' />
                                </DeviceConnectControl>
                            }
                        </Col>
                    </Row>
                    <Row className='App__program-block-editor'>
                        <Col>
                            <ProgramBlockEditor
                                minVisibleSteps={6}
                                program={this.state.program}
                                selectedAction={this.state.selectedAction}
                                onSelectAction={this.handleSelectAction}
                                onChange={this.handleChangeProgram}
                            />
                        </Col>
                        <Col>
                            <div className='App__interpreter-controls'>
                                <button onClick={this.handleClickRun} aria-label={`Run current program ${this.state.program.join(' ')}`}>
                                    <Image src={playIcon} />
                                </button>
                            </div>
                        </Col>
                    </Row>
                    <Row className='App__command-palette'>
                        <Col>
                            {localizeProperties((intl) =>
                                <CommandPalette id='commandPalette' defaultActiveKey='movements' >
                                    <CommandPaletteCategory eventKey='movements' title={(intl.formatMessage({ id: 'CommandPalette.movementsTitle' }))}>
                                        <CommandPaletteCommand commandName='forward' icon={arrowUp} selectedCommandName={this.getSelectedCommandName()} onChange={this.handleCommandFromCommandPalette}/>
                                        <CommandPaletteCommand commandName='left' icon={arrowLeft} selectedCommandName={this.getSelectedCommandName()} onChange={this.handleCommandFromCommandPalette}/>
                                        <CommandPaletteCommand commandName='right' icon={arrowRight} selectedCommandName={this.getSelectedCommandName()} onChange={this.handleCommandFromCommandPalette}/>
                                    </CommandPaletteCategory>
                                    <CommandPaletteCategory eventKey='sounds' title={(intl.formatMessage({ id: 'CommandPalette.soundsTitle' }))}>
                                    </CommandPaletteCategory>
                                </CommandPalette>
                            )}
                        </Col>
                    </Row>
                </Container>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        // Dash Connection Status
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            // TODO: Handle Dash disconnection

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            }
        }
    }
}
