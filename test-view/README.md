# Test view

To start:

- Follow instructions for `view`
- `yarn` to install dependencies
- `yarn link "view"` to use the view package
- `yarn start`

## Avoiding duplicate React and ReactDOM

To get around this problem (described [here](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react)), we need to link the `react` and
`react-dom` versions in `view` to the versions in this package:

```sh
# Link react and react-dom
cd node_modules/react && yarn link && cd ../react-dom && yarn link

# Use the linked versions in view
cd ../../../view && yarn link react && yarn link react-dom
```
