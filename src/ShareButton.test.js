// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import messages from './messages.json';

import ShareButton from './ShareButton';

configure({ adapter: new Adapter()});

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

function createShareButton(props) {
    const wrapper = shallow(
        React.createElement(
            ShareButton.WrappedComponent,
            Object.assign(
                {},
                {
                    intl: intl
                },
                props
            )
        )
    );

    return wrapper;
}

// TODO: Figure how to do this properly with the required intl infrastructure
it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ShareButton intl={intl}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('hides modal on startup', () => {
    const wrapper = createShareButton();

    const modal = wrapper.children().at(1);
    expect(modal.props().show).toBe(false);
});

it('displays modal on click', () => {
    const wrapper = createShareButton();
    const button = wrapper.children().at(0);
    button.simulate("click");

    const modal = wrapper.children().at(1);
    expect(modal.props().show).toBe(true);
});

it('copies URL to clipboard on click', () => {
    let currentClipboard = "";
    Object.assign(navigator, {
        // $FlowFixMe: Flow wants to to mock the full clipboard before we do this.
        clipboard: {
            readText: () => {
                return Promise.resolve(currentClipboard);
            },
            writeText: (textToWrite) => {
                currentClipboard = textToWrite;
                return Promise.resolve(textToWrite);
            }
        }
    });

    const wrapper = createShareButton();
    const button = wrapper.children().at(0);
    button.simulate("click");

    navigator.clipboard.readText().then((clipBoardText) => {
        expect(clipBoardText).toBe(document.location.href);
    });
});
