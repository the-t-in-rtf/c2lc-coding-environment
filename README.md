# Coding to Learn and Create (C2LC) Interface

C2LC Interface is a web user interface to connect to different coding robots to control them.<br>
Currently, the interface can only support Dash, but we are planning to expand available robots.

## Installation

Running this project requires [npm and Node.js](https://www.npmjs.com/get-npm); once you download or fork the source code, run npm install to get all required dependencies.

```bash
npm install
```

## Start the application

```bash
npm start
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Test

```bash
npm run test
```

Launches the test runner in the interactive watch mode.<br>
We are using [Enzyme](https://airbnb.io/enzyme/) as our testing framework.

## Static Type Check

```bash
npx flow
```

We are using flow as static type checker. <br>
Learn more about [flow](https://flow.org/)

## Contributing

Any contribution are welcome, we require you to fork from the [main repo](https://github.com/codelearncreate/c2lc-coding-environment) and follow branch name convention of C2LC-#. You can check open tasks/tickets on [fluid](https://issues.fluidproject.org/projects/C2LC/issues)

Please note that making this project accessible is our first priority. Here's a guide line from [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)

Before sumbiting pull requests, make sure [flow](https://flow.org/) and test cases are passing from the CI pipeline.

## License
[BDS-3](https://github.com/codelearncreate/c2lc-coding-environment/blob/master/LICENSE.txt)
