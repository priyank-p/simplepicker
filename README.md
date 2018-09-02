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


#### API

This library is exported as a constructor, so you will need to create
and instance of the simplepicker.

#### `new SimplePicker([el])`:
  * `el` (optional, `string`, `Element`) - this parameter is optional
  but if no selector or element is passed it defaults to `body`.

Creates new simplepicker instance, and inserts it into the dom. Throws
error only if the selector passed is not valid.

```javascript
const simplepicker = new SimplePicker();
```

#### `simplepicker.open()` 

This method opens the date and time picker: simplepicker. The picker
is hidden automatically when the `Cancel` button or the overlay is clicked.

If it closed due to an user action the `close` event is triggred whereas
if the user selected an date the `submit` event it triggred.
