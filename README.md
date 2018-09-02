# simplepicker

Simple date and time picker in vanilla js.
This project is mostly based on [material-datetime-picker](https://github.com/ripjar/material-datetime-picker), but
without it relying on external dependencies like `moment`,
`rome`, and `materialize` and being simple.

## Usage

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


## API

This library is exported as a constructor, so you will need to create
and instance of the simplepicker.

#### `new SimplePicker([el, opts])`:
  * `el` (optional, `string`, `Element`) - this parameter is optional
  but if no selector or element is passed it defaults to `body`.

  * `opts` (optional, `object`) - possible options:
    - `zIndex` (`number`): sets the `z-index` for the simplepicker.

The first argument passed could be `opts`.
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

#### `simplepicker.close()`

This method closes the picker without the user's action.
Make sure you are not runing user experience unnessacary.

#### `simplepicker.on(event, handler)`:
  - `event` (required, `string`): The name of the event, currently
    `submit`, and `close` are supported.
  - `handler` (required, `function`): This handler is called then
    the event is triggred.

This function add listeners to simplepicker, which are called on sepecific events.
There could be multiple event listeners to a sepecific event.

Events:
  - `submit`: `handler(date, readableDate)` - Called
    when user selects the date. It is called with two arguments:
    `date` is first arguments that is a javascript date object, and
    the second parameter is `readableDate` a string with date in format
    `1st October 2018 12:00 AM`.
  - `close`: `handler()` - It is called when due to user's action the
    picker was close. It happens when user clicks the cancel button
    or the picker overlay. Its handlers are called with no arguments. 
