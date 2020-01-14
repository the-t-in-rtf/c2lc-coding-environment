// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import AriaDisablingButton from './AriaDisablingButton';

configure({ adapter: new Adapter()});

test('Enabled button with no className or extra props', () => {
    const mockClickHandler = jest.fn();

    const wrapper = shallow(
        <AriaDisablingButton
            onClick={mockClickHandler}
            disabled={false}
        >
            someContent
        </AriaDisablingButton>
    );

    const wrappedButton = wrapper.find(Button).at(0);

    expect(wrappedButton.props()['aria-disabled']).toBe(false);
    expect(wrappedButton.props()['children']).toBe('someContent');
    expect(wrappedButton.hasClass('button--disabled')).toBe(false);

    wrappedButton.simulate('click');
    expect(mockClickHandler.mock.calls.length).toBe(1);
});

test('Disabled button with no className or extra props', () => {
    const mockClickHandler = jest.fn();

    const wrapper = shallow(
        <AriaDisablingButton
            onClick={mockClickHandler}
            disabled={true}
        >
            someContent
        </AriaDisablingButton>
    );

    const wrappedButton = wrapper.find(Button).at(0);

    expect(wrappedButton.props()['aria-disabled']).toBe(true);
    expect(wrappedButton.props()['children']).toBe('someContent');
    expect(wrappedButton.hasClass('button--disabled')).toBe(true);

    wrappedButton.simulate('click');
    expect(mockClickHandler.mock.calls.length).toBe(0);
});

test('Enabled button with className and extra props', () => {
    const mockClickHandler = jest.fn();

    const wrapper = shallow(
        <AriaDisablingButton
            onClick={mockClickHandler}
            disabled={false}
            className='someClass1 someClass2'
            anotherProp1='anotherPropValue1'
            anotherProp2='anotherPropValue2'
        >
            someContent
        </AriaDisablingButton>
    );

    const wrappedButton = wrapper.find(Button).at(0);

    expect(wrappedButton.props()['aria-disabled']).toBe(false);
    expect(wrappedButton.props()['anotherProp1']).toBe('anotherPropValue1');
    expect(wrappedButton.props()['anotherProp2']).toBe('anotherPropValue2');
    expect(wrappedButton.props()['children']).toBe('someContent');
    expect(wrappedButton.hasClass('someClass1')).toBe(true);
    expect(wrappedButton.hasClass('someClass2')).toBe(true);
    expect(wrappedButton.hasClass('button--disabled')).toBe(false);

    wrappedButton.simulate('click');
    expect(mockClickHandler.mock.calls.length).toBe(1);
});

test('Disabled button with className and extra props', () => {
    const mockClickHandler = jest.fn();

    const wrapper = shallow(
        <AriaDisablingButton
            onClick={mockClickHandler}
            disabled={true}
            className='someClass1 someClass2'
            anotherProp1='anotherPropValue1'
            anotherProp2='anotherPropValue2'
        >
            someContent
        </AriaDisablingButton>
    );

    const wrappedButton = wrapper.find(Button).at(0);

    expect(wrappedButton.props()['aria-disabled']).toBe(true);
    expect(wrappedButton.props()['anotherProp1']).toBe('anotherPropValue1');
    expect(wrappedButton.props()['anotherProp2']).toBe('anotherPropValue2');
    expect(wrappedButton.props()['children']).toBe('someContent');
    expect(wrappedButton.hasClass('someClass1')).toBe(true);
    expect(wrappedButton.hasClass('someClass2')).toBe(true);
    expect(wrappedButton.hasClass('button--disabled')).toBe(true);

    wrappedButton.simulate('click');
    expect(mockClickHandler.mock.calls.length).toBe(0);
});
