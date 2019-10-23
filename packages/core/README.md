# Core functionality

## Getting started

- `yarn` to install dependencies

`yarn watch` can be used to watch for changes and continuously build the package whenever something changes.

## Testing

To test:

- `ORG=xxxxxx TOKEN=xxxxxx yarn test`

Where `ORG` is the Ardoq organization, and `TOKEN` is your API token.
This will run all the `*.test.js` files in `src/`.

## Linting and formatting

- `yarn lint` runs ESLint and prints its output
- `yarn lint:fix` runs ESLint and fixes any auto-fixable problems
- `yarn format` formats all code with Prettier

There is also a pre-commit hook that automatically lints and formats staged files.
