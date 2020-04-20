type SimplePickerEvent = 'submit' | 'close';

interface SimplePickerOpts {
  zIndex: number;
  compactMode: boolean;
  disableTimeSection: boolean;
}

declare class SimplePicker {
  /**
   * Inserts simplepicker into given element or selector.
   */
  constructor(el?: string | HTMLElement | SimplePickerOpts, opts?: SimplePickerOpts);

  /**
   * Opens the simplepicker.
   */
  open();

  /**
   * closes the simplepicker.
   */
  close();

  /**
   * Make the simplepicker compact; the big date
   * area of selected date i.e 25th is not displayed
   */
  compactMode();

  /**
   * Calls the method passed in when a event occurs.
   */
  on(event: SimplePickerEvent, callback: Function);

  /**
   * Reset simplepicker to today's date.
   * Note: this de-selects anything the user selected!!!
   */
  reset(newDate?: Date);

  readonly selectedDate: Date;
  readonly _validOnListeners: string[];
}

export as namespace SimplePicker;
export = SimplePicker;
