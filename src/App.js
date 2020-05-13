// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import classNames from 'classnames';
import BluetoothApiWarning from './BluetoothApiWarning';
import CommandPaletteCommand from './CommandPaletteCommand';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import * as FeatureDetection from './FeatureDetection';
import Interpreter from './Interpreter';
import type { InterpreterRunningState } from './Interpreter';
import ProgramBlockEditor from './ProgramBlockEditor';
import { programIsEmpty } from './ProgramUtils';
import * as Utils from './Utils';
import type { DeviceConnectionStatus, Program, RobotDriver, SelectedAction } from './types';
import messages from './messages.json';
import './App.scss';
import AddModeImage from './AddModeImage';
import DeleteModeImage from './DeleteModeImage';

// Uncomment to use the FakeRobotDriver (see driver construction below also)
//import FakeRobotDriver from './FakeRobotDriver';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string
};

type AppState = {
    program: Program,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    activeProgramStepNum: ?number,
    interpreterIsRunning: boolean,
    showDashConnectionError: boolean,
    selectedAction: SelectedAction,
    draggingCommand: ?string
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    addModeDescriptionId: string;
    deleteModeDescriptionId: string;

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.state = {
            program: [],
            settings: {
                language: 'en'
            },
            dashConnectionStatus: 'notConnected',
            activeProgramStepNum: null,
            interpreterIsRunning: false,
            showDashConnectionError: false,
            selectedAction: null,
            draggingCommand: null
        };

        this.interpreter = new Interpreter(this.handleRunningStateChange);

        this.interpreter.addCommandHandler(
            'none',
            'noneHandler',
            () => {
                return Promise.resolve();
            }
        );

        // For FakeRobotDriver, replace with: this.dashDriver = new FakeRobotDriver();
        this.dashDriver = new DashDriver();

        this.addModeDescriptionId = Utils.generateId('addModeDescription');
        this.deleteModeDescriptionId = Utils.generateId('deleteModeDescription');
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
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
        this.interpreter.run(this.state.program).then(
            () => {}, // Do nothing on successful resolution
            (error) => {
                console.log(error.name);
                console.log(error.message);
            }
        );
    };

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting',
            showDashConnectionError: false
        });
        this.dashDriver.connect(this.handleDashDisconnect).then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error) => {
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            this.setState({
                dashConnectionStatus: 'notConnected',
                showDashConnectionError: true
            });
        });
    };

    handleCancelDashConnection = () => {
        this.setState({
            showDashConnectionError: false
        });
    };

    handleDashDisconnect = () => {
        this.setState({
            dashConnectionStatus : 'notConnected'
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

    handleDragStartCommand = (command: string) => {
        this.setState({ draggingCommand: command });
    };

    handleDragEndCommand = () => {
        this.setState({ draggingCommand: null });
    };

    handleSelectAction = (action: SelectedAction) => {
        this.setState({
            selectedAction: action
        });
    };

    handleRunningStateChange = ( interpreterRunningState : InterpreterRunningState) => {
        this.setState({
            activeProgramStepNum: interpreterRunningState.activeStep,
            interpreterIsRunning: interpreterRunningState.isRunning
        });
    }

    render() {
        const appClasses = classNames(
            this.state.draggingCommand && 'App--is-dragging-command'
        );
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <div className={appClasses}>
                <header className='App__header'>
                    <Container>
                        <Row className='App__header-row'>
                            <h1 className='App__app-heading'>
                                <FormattedMessage id='App.appHeading'/>
                            </h1>
                            <DeviceConnectControl
                                disabled={
                                    !this.appContext.bluetoothApiIsAvailable ||
                                    this.state.dashConnectionStatus === 'connected' }
                                connectionStatus={this.state.dashConnectionStatus}
                                onClickConnect={this.handleClickConnectDash}>
                                <FormattedMessage id='App.connectToDash' />
                            </DeviceConnectControl>
                        </Row>
                    </Container>
                </header>
                <Container role='main' className='mb-5'>
                    {!this.appContext.bluetoothApiIsAvailable &&
                        <Row className='App__bluetooth-api-warning-section'>
                            <Col>
                                <BluetoothApiWarning/>
                            </Col>
                        </Row>
                    }
                    <Row className='App__program-section' noGutters={true}>
                        <Col md={4} lg={3} className='pr-md-3 mb-3 mb-md-0'>
                            <div className='App__command-palette'>
                                <h2 className='App__command-palette-heading'>
                                    <FormattedMessage id='CommandPalette.movementsTitle' />
                                </h2>
                                <div className='App__command-palette-command'>
                                    <CommandPaletteCommand
                                        commandName='forward'
                                        selectedCommandName={this.getSelectedCommandName()}
                                        onChange={this.handleCommandFromCommandPalette}
                                        onDragStart={this.handleDragStartCommand}
                                        onDragEnd={this.handleDragEndCommand}/>
                                </div>
                                <div className='App__command-palette-command'>
                                    <CommandPaletteCommand
                                        commandName='right'
                                        selectedCommandName={this.getSelectedCommandName()}
                                        onChange={this.handleCommandFromCommandPalette}
                                        onDragStart={this.handleDragStartCommand}
                                        onDragEnd={this.handleDragEndCommand}/>
                                </div>
                                <div className='App__command-palette-command'>
                                    <CommandPaletteCommand
                                        commandName='left'
                                        selectedCommandName={this.getSelectedCommandName()}
                                        onChange={this.handleCommandFromCommandPalette}
                                        onDragStart={this.handleDragStartCommand}
                                        onDragEnd={this.handleDragEndCommand}/>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={6}>
                            <ProgramBlockEditor
                                activeProgramStepNum={this.state.activeProgramStepNum}
                                editingDisabled={this.state.interpreterIsRunning === true}
                                interpreterIsRunning={this.state.interpreterIsRunning}
                                program={this.state.program}
                                selectedAction={this.state.selectedAction}
                                draggingCommand={this.state.draggingCommand}
                                runButtonDisabled={
                                    this.state.dashConnectionStatus !== 'connected' ||
                                    this.state.interpreterIsRunning ||
                                    programIsEmpty(this.state.program)}
                                addModeDescriptionId={this.addModeDescriptionId}
                                deleteModeDescriptionId={this.deleteModeDescriptionId}
                                onClickRunButton={this.handleClickRun}
                                onSelectAction={this.handleSelectAction}
                                onChange={this.handleChangeProgram}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2 className='App__instructions-heading'>
                                <FormattedMessage id='App.instructions.heading' />
                            </h2>
                            <h3 className="App__instructions-section-heading">
                                <FormattedMessage id='App.instructions.addHeading' />
                            </h3>
                            <div className='App__instructions-text' id={this.addModeDescriptionId}>
                                <FormattedMessage id='App.instructions.addText1' />
                                <AddModeImage className='App__add-mode-image'/>
                                <FormattedMessage id='App.instructions.addText2' />
                            </div>
                            <h3 className="App__instructions-section-heading">
                                <FormattedMessage id='App.instructions.deleteHeading' />
                            </h3>
                            <div className='App__instructions-text' id={this.deleteModeDescriptionId}>
                                <FormattedMessage id='App.instructions.deleteText1' />
                                <DeleteModeImage className='App__delete-mode-image'/>
                                <FormattedMessage id='App.instructions.deleteText2' />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </div>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        //console.log(this.state.selectedAction);
        console.log(this.state.draggingCommand);
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            } else if (this.state.dashConnectionStatus === 'notConnected') {
                // TODO: Remove Dash handlers

                if (this.state.interpreterIsRunning) {
                    this.interpreter.stop();
                }
            }
        }
    }
}
