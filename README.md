# User Interface for the Construction of Graph Database Queries

## Introduction

This repository contains the code produced by team 14 in the course [TDT4290 Customer Driven Project](https://www.ntnu.edu/studies/courses/TDT4290), during the fall semester 2019. The team's customer is [Ardoq](https://www.ardoq.com/).

The project is divided into two packages, called `core` and `view`.
This is done because the customer wanted to integrate this product into their existing web application.
To simulate this situation the team also created a `test-view` package, that starts a React app, loads `core` and `view`, and displays the result in a browser.
The packages are managed with [Lerna](https://lerna.js.org/).

## Getting Started

### Prerequisites

- [Yarn](https://yarnpkg.com/lang/en/)
- [Node.js](https://nodejs.org/en/)

### Installation

Run `yarn` to install dependencies and bootstrap packages.

### Usage

The following commands can be run from the root directory of the repository.

- Build all packages with `yarn build`.

  (`yarn watch` will build `core` and `view` continuously.)

- Fire up `test-view` with `yarn start`.

  Make sure the environment variables `REACT_APP_ORG` and `REACT_APP_TOKEN` are set.
  `REACT_APP_ORG` should contain an Ardoq organization identifier, and `REACT_APP_TOKEN` an Ardoq API token.

## License

This project is [GPLv3 licensed](https://github.com/strandlie/tdt4290/blob/dev/LICENCE.md).
