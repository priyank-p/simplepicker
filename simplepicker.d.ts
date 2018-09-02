// Type definitions for [SimplePicker] [1.0.1]
// Project: [SimplePicker]
// Definitions by: [Priyank Patel] <https://github.com/priyankp10>


type SimplePickerEvent = 'submit' | 'close';

interface SimplePickerOpts {
  zIndex: number;
}

declare class SimplePicker {
  /**
   * Inserts simplepicker into given element or selector.
   */
  constructor(el?: string | HTMLElement, opts?: SimplePickerOpts);

  /**
   * Opens the simplepicker.
   */
  open();

  /**
   * closes the simplepicker.
   */
  close();


  /**
   * Calls the method passed in when a event occurs.
   */
  on(event: SimplePickerEvent, callback: Function);

  readonly selectedDate: Date;
  readonly _validOnListeners: string[];
}

export as namespace SimplePicker;
export = SimplePicker;
