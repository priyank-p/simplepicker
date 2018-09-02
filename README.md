# simplepicker

Simple date and time picker in vanilla js.
This project is mostly based on [material-datetime-picker](https://github.com/ripjar/material-datetime-picker), but
without it relying on external dependencies like `moment`,
`rome`, and `materialize` and being simple.

#### Usage

To use simplepicker in your project you will need to include
both css and js into your project. CSS file is included in
`dist/simplepicker.css` and also the js file `dist/simplepicker.js`.

If you use a build tools, therefore `require` or ES6 `import`, you can also
require or import it, but if you use typescript you will need to do
`import SimplePicker = require('simplepicker');`.

If you include the js file in dist folder, `SimplePicker` is defined using
`var` declaration therefore avalible as `SimplePicker`;

For typescript we also provide a typescript declaration file with
the npm package.
