declare type SimplePickerEvent = 'submit' | 'close';
interface SimplePickerOpts {
    zIndex?: number;
    compactMode?: boolean;
    disableTimeSection?: boolean;
    selectedDate?: Date;
}
declare type HandlerFunction = (...args: unknown[]) => void;
interface EventHandlers {
    [key: string]: HandlerFunction[];
}
declare class SimplePicker {
    selectedDate: Date;
    $simplePicker: HTMLElement;
    readableDate: string;
    _eventHandlers: EventHandlers;
    _validOnListeners: readonly ["submit", "close"];
    private opts;
    private $;
    private $$;
    private $simplepicker;
    private $simplepickerWrapper;
    private $trs;
    private $tds;
    private $headerMonthAndYear;
    private $monthAndYear;
    private $date;
    private $day;
    private $time;
    private $timeInput;
    private $timeSectionIcon;
    private $cancel;
    private $ok;
    private $displayDateElements;
    constructor(arg1?: HTMLElement | string | SimplePickerOpts, arg2?: SimplePickerOpts);
    initElMethod(el: any): void;
    init(el: HTMLElement, opts: SimplePickerOpts): void;
    reset(newDate?: Date): void;
    compactMode(): void;
    disableTimeSection(): void;
    enableTimeSection(): void;
    injectTemplate(el: HTMLElement): void;
    clearRows(): void;
    updateDateComponents(date: Date): void;
    render(data: any): void;
    updateSelectedDate(el?: HTMLElement): void;
    selectDateElement(el: HTMLElement): void;
    findElementWithDate(date: any, returnLastIfNotFound?: boolean): any;
    handleIconButtonClick(el: HTMLElement): void;
    initListeners(): void;
    callEvent(event: SimplePickerEvent, dispatcher: (a: HandlerFunction) => void): void;
    open(): void;
    close(): void;
    on(event: SimplePickerEvent, handler: HandlerFunction): void;
    toogleDisplayFade(): void;
}
export = SimplePicker;
