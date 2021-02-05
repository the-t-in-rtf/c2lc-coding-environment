# Contributing to the C2LC coding environment

We use [rooms on Matrix.org](https://wiki.fluidproject.org/display/fluid/Matrix+Channel) to communicate as a team.  The
first step in contributing should be to introduce yourself and discuss what you have in mind to do.

We use [pull requests](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
to review proposed changes to our codebase. These are submitted from an individual's fork of our main repository
and compared with a particular development branch that corresponds to an upcoming release. The rough process is as
follows:

1. Discuss the issue with the team.
2. Check with the team to see which development branch you should work with.
3. If [a JIRA ticket](https://issues.fluidproject.org/projects/C2LC/issues) does not already exist for the issue, please
   create one. Make sure to use the version agreed on above as the "fix version".
4. If you have not already done so, fork our main repository.
5. If you are working with an existing fork, make sure your copy of the development branch is up-to-date.
6. Create a named branch that corresponds to the JIRA ticket you are working to address, i.e. `C2LC-#`
7. Each commit message that you submit against your branch should begin with the issue number, and use singular present
   tense. For example, "C2LC-30: Update the README to include more information about how to contribute".
8. Before submitting a pull requests, please make sure all static type checks and test cases (see below) are passing.
9. When your work is ready for review, submit a pull request against the desired development branch.
10. Your work will automatically be tested by our Continuous Integration. Please review and work to address any errors
   reported.
11. Your work will be reviewed and commented upon and you and the reviewer will discuss and agree on what (if anything)
    needs to be done before the work can be accepted.
12. Once the work and related discussion are complete, an accepted change is merged with the development branch.

For more details about the technologies used and the standards for an acceptable pull request, please read on.

## Accessibility

Accessibility is an important part of our project, and all work submitted against our repository is expected to preserve
or improve the level of accessibility of the project.

If you have any questions about accessibility, please feel free to ask questions. The
[W3C's WCAG guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) are a good place to start learning about
accessibility on the web.

## Technologies and Coding Conventions Used

### React

The coding environment is written using [React](https://reactjs.org). Here are a few guidelines regarding how we prefer
to work with React:

- Organize CSS by React component, storing the CSS for a component in a file named `COMPONENT.css` (for example
  `TextEditor.css`)
- Use [BEM](http://getbem.com/) (Block Element Modifier) to name and structure styles
- Do instance property initialization in the constructor
- Use [prototype method syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Prototype_methods)
  for class methods
- Use public class field syntax for React event handlers
  - [Handling Events (React documentation)](https://reactjs.org/docs/handling-events.html)
  - [Event Handling for React (Flow documentation)](https://flow.org/en/docs/react/events/)
  - [Ecma TC39 "Class field declarations for JavaScript" proposal](https://github.com/tc39/proposal-class-fields)
- Provide dependencies to an object instance via constructor parameters
- Prefer single quotes for string literals

In addition, here are the naming conventions we use:

- JavaScript classes: UpperCamelCase
- Flow types: UpperCamelCase
- Methods and Functions: lowerCamelCase
- Event handlers begin with "handle" (for example `handleClick`)
- Event emitters begin with "on" (for example `onClick={this.handleClick}`)

### Linting

Where possible, code conventions are enforced by running ESLint. Many of the rules we use are inherited from
[a common configuration for React apps](https://www.npmjs.com/package/eslint-config-react-app). Additional rules can
be found in our [`package.json` file](../package.json).

You can check your work in progress against our coding conventions using a command like:

```shell
npx eslint .
```

Although our conventions are open for discussion, in general you should strive to ensure that your work passes ESLint
checks before submitting your pull request.

## Static Type Checking

We are using [Flow](https://flow.org/) as our static type checker. Contributions are expected to include Flow type
annotations and to ensure that both the type checks pass. You can run the type checks using a command like:

```shell
npx flow
```

We use a package called `flow-coverage-report` to test how much of our work includes type annotations. To see the
current level of coverage (and confirm whether your changes meet our coverage threshold), you can use a command like:

```shell
npx flow-coverage-report --config .flowcoverage-main-threshold
```

If you need to add types for libraries or other content, see [our Flow typing document](flow-typing.md)

## Writing Tests

Changes to this package are expected to be accompanied by tests, ideally that demonstrate that the change works as
expected. Our tests are written in [Jest](https://jestjs.io) and [Enzyme](https://enzymejs.github.io/enzyme/). The
tests for a given component should match the component's name, so tests for `MyClass.js` would be stored in
`MyClass.test.js`.

Tests can be run using a command like:

```shell
npm test
```

To check that your work in progress meets our standards for test code coverage, you can use a command like:

```shell
npm test -- --verbose --coverage
```

As there are some things that are difficult to test, these guidelines are flexible and open for discussion as part of
the review.

## Internationalisation

We use [react-intl](https://formatjs.io/docs/react-intl/) to support presenting our work in multiple languages. We
store messages in [`messages.json`](../src/messages.json) and reference their "message key" in our code.

### Testing with Enzyme and react-intl

Components that present textual content to users have to be tested in a slightly different fashion than components
that do not make use of react-intl. This section of the document describes how to write tests for internationalised
components.

Enzyme offers a few means of testing components, so we provide examples for both "shallow" and DOM rendering
(aka "mount").

#### Shallow Rendering

When `injectIntl` is used, render `ComponentUnderTest.WrappedComponent` with an `intl` prop:

```javascript
import { createIntl } from 'react-intl';

const intl = createIntl({
    locale,
    defaultLocale,
    messages
});

const wrapper = shallow(
    <ComponentUnderTest.WrappedComponent
        intl={intl} />
);
```

Otherwise, render `ComponentUnderTest` directly:

```javascript
const wrapper = shallow(
    <ComponentUnderTest />
);
```

#### DOM Rendering

Render `ComponentUnderTest` with an `IntlProvider` `wrappingComponent`:

```javascript
import { IntlProvider } from 'react-intl';

const wrapper = mount(
    <ComponentUnderTest />,
    {
        wrappingComponent: IntlProvider,
        wrappingComponentProps: {
            locale,
            defaultLocale,
            messages
        }
    }
);
```