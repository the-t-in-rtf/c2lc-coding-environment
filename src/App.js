// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import BluetoothApiWarning from './BluetoothApiWarning';
import CommandPaletteCommand from './CommandPaletteCommand';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import * as FeatureDetection from './FeatureDetection';
import FocusTrapManager from './FocusTrapManager';
import Interpreter from './Interpreter';
import type { InterpreterRunningState } from './Interpreter';
import ProgramBlockEditor from './ProgramBlockEditor';
import { programIsEmpty } from './ProgramUtils';
import * as Utils from './Utils';
import type { DeviceConnectionStatus, Program, RobotDriver } from './types';
import messages from './messages.json';
import './App.scss';

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
    selectedAction: ?string,
    replaceIsActive: boolean
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    toCommandPaletteNoticeId: string;
    focusTrapManager: FocusTrapManager;

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
            replaceIsActive: false
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

        this.toCommandPaletteNoticeId = Utils.generateId('toCommandPaletteNotice');

        this.focusTrapManager = new FocusTrapManager();
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    getSelectedCommandName() {
        if (this.state.selectedAction !== null) {
            return this.state.selectedAction;
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

    handleSetReplaceIsActive = (booleanValue: boolean) => {
        this.setState({
            replaceIsActive: booleanValue
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
                selectedAction: command
            });
        } else {
            this.setState({
                selectedAction: null
            });
        }
    };

    handleRunningStateChange = ( interpreterRunningState : InterpreterRunningState) => {
        this.setState({
            activeProgramStepNum: interpreterRunningState.activeStep,
            interpreterIsRunning: interpreterRunningState.isRunning
        });
    };

    handleRootKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.focusTrapManager.handleKeyDown(e);
    };

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
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
                <Container role='main' className='App__main-container' onKeyDown={this.handleRootKeyDown}>
                    {!this.appContext.bluetoothApiIsAvailable &&
                        <Row className='App__bluetooth-api-warning-section'>
                            <Col>
                                <BluetoothApiWarning/>
                            </Col>
                        </Row>
                    }
                    <div className='App__command-palette'>
                        <h2 className='App__command-palette-heading'>
                            <FormattedMessage id='CommandPalette.movementsTitle' />
                        </h2>
                        <div className='App__command-palette-command'>
                            <CommandPaletteCommand
                                commandName='forward'
                                selectedCommandName={this.getSelectedCommandName()}
                                onChange={this.handleCommandFromCommandPalette}/>
                        </div>
                        <div className='App__command-palette-command'>
                            <CommandPaletteCommand
                                commandName='right'
                                selectedCommandName={this.getSelectedCommandName()}
                                onChange={this.handleCommandFromCommandPalette}/>
                        </div>
                        <div className='App__command-palette-command'>
                            <CommandPaletteCommand
                                commandName='left'
                                selectedCommandName={this.getSelectedCommandName()}
                                onChange={this.handleCommandFromCommandPalette}/>
                        </div>
                    </div>
                    <div className='App__program-section'>
                        <ProgramBlockEditor
                            activeProgramStepNum={this.state.activeProgramStepNum}
                            editingDisabled={this.state.interpreterIsRunning === true}
                            interpreterIsRunning={this.state.interpreterIsRunning}
                            program={this.state.program}
                            selectedAction={this.state.selectedAction}
                            replaceIsActive={this.state.replaceIsActive}
                            runButtonDisabled={
                                this.state.dashConnectionStatus !== 'connected' ||
                                this.state.interpreterIsRunning ||
                                programIsEmpty(this.state.program)}
                            focusTrapManager={this.focusTrapManager}
                            onClickRunButton={this.handleClickRun}
                            onSetReplaceIsActive={this.handleSetReplaceIsActive}
                            onChange={this.handleChangeProgram}
                        />
                    </div>
                </Container>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
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
