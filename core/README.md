# Core functionality

To start:
* `yarn` to install dependencies
* `yarn build` to build the package
* `yarn link` to be able to use the package in other projects

You need to run `yarn build` if you change some code here, we can automate this in the future.


To test:
* `ORG=xxxxxx TOKEN=xxxxxx yarn test`

Where `ORG` is the Ardoq organization, and `TOKEN` is your API token.
This will run all the `*.test.js` files in `src/`.
