// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import IntlContainer from './IntlContainer';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
});
