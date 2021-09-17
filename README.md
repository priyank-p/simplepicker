# simplepicker

Simple datetime picker in vanilla javascript.
This project is mostly based on [material-datetime-picker](https://github.com/ripjar/material-datetime-picker), but
without it relying on external dependencies like `moment`,
`rome`, and `materialize`.

## Installation

Install from npm:
```
npm install simplepicker
```

We also started to [publish this package](https://github.com/priyank-p/simplepicker/packages/) (starting from v2.0.0) to GitHub's package registry.
If you prefer the installing it from there you will need to [follow GitHub's instructions](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#installing-a-package).

## Usage

To use simplepicker in your project you will need to include
CSS and JavaScript files in `dist/` directory. CSS file `dist/simplepicker.css`
is used to style the simplepicker and the JavaScript file required is in `dist/simplepicker.js`.

If you use build tools, therefore `require` or ES6 `import`, you can also
`require` or `import` simplepicker; if you use typescript you'll need to do
`import SimplePicker = require('simplepicker');`.

If you include the js file in dist folder, `SimplePicker` is defined using
`var` declaration and is avalible as `SimplePicker`.

For typescript projects we provide the typescript declaration file
with the npm package.

## API

This library is exported as a constructor, so you will need to create
and instance of the simplepicker.

#### `new SimplePicker([el, opts])`:
  * `el` (optional, `string`, `Element`) - this parameter is optional
  but if no selector or element is passed it defaults to `body`.

  * `opts` (optional, `object`) - possible options:
    - `zIndex` (`number`): sets the `z-index` for the simplepicker.
    - `disableTimeSection` (`boolean`): If `true` disables the time picker section.
    - `compactMode` (`boolean`): If `true` the simplepicker will be more compact; the large
                                 display of the selected date, i.e. 25th will not be displayed.
    - `selectedDate` (`Date`): initialize the simplepicker with this date, if not used then today
                               will be used

The first argument passed could be `opts`.

This method creates new simplepicker instance, and inserts it into the dom.
It throws error only if the selector passed is not valid.
```javascript
const simplepicker = new SimplePicker();
```

**Note:** You can have two `SimplePicker` instances but they both must have
two diffrent element passed in to bind to otherwise they both will trigger the same
event; this is beacuse they both will respond to event triggred by the same element.

```javascript
// below both picker1 and picker2 are the same.
const picker1 = new SimplePicker();
const picker2 = new SimplePicker();

// but to have to diffrent picker on same page
// you will need to pass a diffrent selector as shown below.
const picker1 = new SimplePicker();
const picker2 = new SimplePicker('.some-element');
```

#### `simplepicker.open()`

This method opens the picker. The picker is hidden automatically
when the `Cancel` button or the overlay is clicked.

If it closed due to an user action the `close` event is triggred whereas
if the user selected an date the `submit` event it triggred. See `on` method
below to listen to these events.

#### `simplepicker.close()`

This method closes the picker without the user's action.
Make sure you are not ruining user experience unnecessarily.

#### `simplepicker.reset(date)`:
  * `date` (optional, `Date`) - The date to select after reset. Default is current date (as in `new Date()`).

**Note**: This method will overrride what the user may have already selected. Therefore,
use it with care considering user experience.

The example below sets resets to a date before showing the picker.
```javascript
const sp = new SimplePicker();
sp.reset(new Date(2019, 12, 31, 7, 0, 0));
sp.open();
```

#### `simplepicker.on(event, handler)`:
  - `event` (required, `string`): The name of the event, currently
    `submit`, and `close` are supported.
  - `handler` (required, `function`): This handler is called then
    the event is triggred.

This function attaches a listener to simplepicker, which are called on sepecific events.
There could be multiple event listeners for a single event.

Events:
  - `submit`: `handler(date, readableDate)` - Called
    when user selects the date. It is called with two arguments:
    `date` is first arguments that is a javascript date object, and
    the second parameter is `readableDate` a string with date in format
    `1st October 2018 12:00 AM`.
  - `close`: `handler()` - It is called when due to user's action the
    picker was close. It happens when user clicks the cancel button
    or the picker overlay. Its handlers are called with no arguments.

#### `simplepicker.disableTimeSection()`

This method disables the time picker section.

#### `simplepicker.enableTimeSection()`

This method re-enables the time picker section if it was previously disabled.
