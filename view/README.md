# Gremlin view

## Getting started

- `yarn` to install dependencies
- `yarn link "core"`to be able to import packages from core
- `yarn build` to build the package
- `yarn link` to be able to use the package in other projects

`yarn watch` can be used to watch for changes and continuously build the package whenever something changes.

## Linting and formatting

- `yarn lint` runs ESLint and prints its output
- `yarn lint:fix` runs ESLint and fixes any auto-fixable problems
- `yarn format` formats all code with Prettier

There is also a pre-commit hook that automatically lints and formats staged files.
