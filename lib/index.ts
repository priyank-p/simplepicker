import * as dateUtil from './date-util';
import { htmlTemplate } from './template';

type SimplePickerEvent = 'submit' | 'close';
interface SimplePickerOpts {
  zIndex?: number;
  compactMode?: boolean;
  disableTimeSection?: boolean;
  selectedDate?: Date;
}

const validListeners = [
  'submit',
  'close',
] as const;

type HandlerFunction = (...args: unknown[]) => void;
interface EventHandlers {
  [key: string]: HandlerFunction[];
}

const today = new Date();
class SimplePicker {
  selectedDate: Date;
  $simplePicker: HTMLElement;
  readableDate: string;
  _eventHandlers: EventHandlers;
  _validOnListeners = validListeners;

  private opts: SimplePickerOpts;
  private $: Function;
  private $$: Function;
  private $simplepicker: HTMLElement;
  private $simplepickerWrapper: HTMLElement;
  private $trs: HTMLElement[];
  private $tds: HTMLElement[];
  private $headerMonthAndYear: HTMLElement;
  private $monthAndYear: HTMLElement;
  private $date: HTMLElement;
  private $day: HTMLElement;
  private $time: HTMLElement;
  private $timeInput: HTMLInputElement;
  private $timeSectionIcon: HTMLElement;
  private $cancel: HTMLElement;
  private $ok: HTMLElement;
  private $displayDateElements: HTMLElement[];

  constructor(arg1?: HTMLElement | string | SimplePickerOpts, arg2?: SimplePickerOpts) {
    let el: HTMLElement | undefined = undefined;
    let opts: SimplePickerOpts | undefined = arg2;

    if (typeof arg1 === 'string') {
      const element = <HTMLElement> document.querySelector(arg1);
      if (element !== null) {
        el = element;
      } else {
        throw new Error('Invalid selector passed to SimplePicker!');
      }
    } else if (arg1 instanceof HTMLElement) {
      el = arg1;
    } else if (typeof arg1 === 'object') {
      opts = arg1 as SimplePickerOpts;
    }

    if (!el) {
      el = <HTMLElement> document.querySelector('body');
    }

    if (!opts) {
      opts = {};
    }

    this.selectedDate = new Date();
    this.injectTemplate(el);
    this.init(el, opts);
    this.initListeners();

    this._eventHandlers = {};
  }

  // We use $, $$ as helper method to conviently select
  // element we need for simplepicker.
  // Also, Limit the query to the wrapper class to avoid
  // selecting elements on the other instance.
  initElMethod(el) {
    this.$ = (sel) => el.querySelector(sel);
    this.$$ = (sel) => el.querySelectorAll(sel);
  }

  init(el: HTMLElement, opts: SimplePickerOpts) {
    this.$simplepickerWrapper = <HTMLElement> el.querySelector('.simplepicker-wrapper');
    this.initElMethod(this.$simplepickerWrapper);

    const { $, $$ } = this;
    this.$simplepicker = $('.simpilepicker-date-picker');
    this.$trs = $$('.simplepicker-calender tbody tr');
    this.$tds = $$('.simplepicker-calender tbody td');
    this.$headerMonthAndYear = $('.simplepicker-month-and-year');
    this.$monthAndYear = $('.simplepicker-selected-date');
    this.$date = $('.simplepicker-date');
    this.$day = $('.simplepicker-day-header');
    this.$time = $('.simplepicker-time');
    this.$timeInput = $('.simplepicker-time-section input');
    this.$timeSectionIcon = $('.simplepicker-icon-time');
    this.$cancel = $('.simplepicker-cancel-btn');
    this.$ok = $('.simplepicker-ok-btn');

    this.$displayDateElements = [
      this.$day,
      this.$headerMonthAndYear,
      this.$date
    ];

    this.$time.classList.add('simplepicker-fade');
    this.render(dateUtil.scrapeMonth(today));

    opts = opts || {};
    this.opts = opts;

    this.reset(opts.selectedDate || today);

    if (opts.zIndex !== undefined) {
      this.$simplepickerWrapper.style.zIndex = opts.zIndex.toString();
    }

    if (opts.disableTimeSection) {
      this.disableTimeSection();
    }

    if (opts.compactMode) {
      this.compactMode();
    }
  }

  // Reset by selecting current date.
  reset(newDate?: Date) {
    let date = newDate || new Date();
    this.render(dateUtil.scrapeMonth(date));

    // The timeFull variable below will be formatted as HH:mm:ss.
    // Using regular experssion we remove the :ss parts.
    const timeFull = date.toTimeString().split(" ")[0]
    const time = timeFull.replace(/\:\d\d$/, "");
    this.$timeInput.value = time;
    this.$time.innerText = dateUtil.formatTimeFromInputElement(time);

    const dateString = date.getDate().toString();
    const $dateEl = this.findElementWithDate(dateString);
    if (!$dateEl.classList.contains('active')) {
      this.selectDateElement($dateEl);
      this.updateDateComponents(date);
    }
  }

  compactMode() {
    const { $date } = this;
    $date.style.display = 'none';
  }

  disableTimeSection() {
    const { $timeSectionIcon } = this;
    $timeSectionIcon.style.visibility = 'hidden';
  }

  enableTimeSection() {
    const { $timeSectionIcon } = this;
    $timeSectionIcon.style.visibility = 'visible';
  }

  injectTemplate(el: HTMLElement) {
    const $template = document.createElement('template');
    $template.innerHTML = htmlTemplate;
    el.appendChild($template.content.cloneNode(true));
  }

  clearRows() {
    this.$tds.forEach((td) => {
      td.innerHTML = '';
      td.classList.remove('active');
    });
  }

  updateDateComponents(date: Date) {
    const day = dateUtil.days[date.getDay()];
    const month = dateUtil.months[date.getMonth()];
    const year = date.getFullYear();
    const monthAndYear = month + ' ' + year;

    this.$headerMonthAndYear.innerHTML = monthAndYear;
    this.$monthAndYear.innerHTML = monthAndYear;
    this.$day.innerHTML = day;
    this.$date.innerHTML = dateUtil.getDisplayDate(date);
  }

  render(data) {
    const { $$, $trs } = this;
    const { month, date } = data;

    this.clearRows();
    month.forEach((week, index) => {
      const $tds = $trs[index].children;
      week.forEach((day, index) => {
        const td = $tds[index];
        if (!day) {
          td.setAttribute('data-empty', '');
          return;
        }

        td.removeAttribute('data-empty');
        td.innerHTML = day;
      });
    });

    const $lastRowDates = $$('table tbody tr:last-child td');
    let lasRowIsEmpty = true;
    $lastRowDates.forEach(date => {
      if (date.dataset.empty === undefined) {
        lasRowIsEmpty = false;
      }
    });

    // hide last row if it's empty to avoid
    // extra spacing due to last row
    const $lastRow = $lastRowDates[0].parentElement;
    if (lasRowIsEmpty && $lastRow) {
      $lastRow.style.display = 'none';
    } else {
      $lastRow.style.display = 'table-row';
    }

    this.updateDateComponents(date);
  }

  updateSelectedDate(el?: HTMLElement) {
    const { $monthAndYear, $time, $date } = this;

    let day;
    if (el) {
      day = el.innerHTML.trim();
    } else {
      day = this.$date.innerHTML.replace(/[a-z]+/, '');
    }

    const [ monthName, year ] = $monthAndYear.innerHTML.split(' ');
    const month = dateUtil.months.indexOf(monthName);
    let timeComponents = $time.innerHTML.split(':');
    let hours = +timeComponents[0];
    let [ minutes, meridium ] = timeComponents[1].split(' ');

    if (meridium === 'AM' && hours == 12) {
      hours = 0;
    }

    if (meridium === 'PM' && hours < 12) {
      hours += 12;
    }

    const date = new Date(+year, +month, +day, +hours, +minutes);
    this.selectedDate = date;

    let _date = day + ' ';
    _date += $monthAndYear.innerHTML.trim() + ' ';
    _date += $time.innerHTML.trim();
    this.readableDate = _date.replace(/^\d+/, date.getDate().toString());
  }

  selectDateElement(el: HTMLElement) {
    const alreadyActive = this.$('.simplepicker-calender tbody .active');
    el.classList.add('active');
    if (alreadyActive) {
      alreadyActive.classList.remove('active');
    }

    this.updateSelectedDate(el);
    this.updateDateComponents(this.selectedDate);
  }

  findElementWithDate(date, returnLastIfNotFound: boolean = false) {
    const { $tds } = this;

    let el, lastTd;
    $tds.forEach((td) => {
      const content = td.innerHTML.trim();
      if (content === date) {
        el = td;
      }

      if (content !== '') {
        lastTd = td;
      }
    });

    if (el === undefined && returnLastIfNotFound) {
      el = lastTd;
    }

    return el;
  }

  handleIconButtonClick(el: HTMLElement) {
    const { $ } = this;
    const baseClass = 'simplepicker-icon-';
    const nextIcon = baseClass + 'next';
    const previousIcon = baseClass + 'previous';
    const calenderIcon = baseClass + 'calender';
    const timeIcon = baseClass + 'time';

    if (el.classList.contains(calenderIcon)) {
      const $timeIcon = $('.' + timeIcon);
      const $timeSection = $('.simplepicker-time-section');
      const $calenderSection = $('.simplepicker-calender-section');

      $calenderSection.style.display = 'block';
      $timeSection.style.display = 'none';
      $timeIcon.classList.remove('active');
      el.classList.add('active');
      this.toogleDisplayFade();
      return;
    }

    if (el.classList.contains(timeIcon)) {
      const $calenderIcon = $('.' + calenderIcon);
      const $calenderSection = $('.simplepicker-calender-section');
      const $timeSection = $('.simplepicker-time-section');

      $timeSection.style.display = 'block';
      $calenderSection.style.display = 'none';
      $calenderIcon.classList.remove('active');
      el.classList.add('active');
      this.toogleDisplayFade();
      return;
    }

    let selectedDate;
    const $active = $('.simplepicker-calender td.active');
    if ($active) {
      selectedDate = $active.innerHTML.trim();
    }

    if (el.classList.contains(nextIcon)) {
      this.render(dateUtil.scrapeNextMonth());
    }

    if (el.classList.contains(previousIcon)) {
      this.render(dateUtil.scrapePreviousMonth());
    }

    if (selectedDate) {
      let $dateTd = this.findElementWithDate(selectedDate, true);
      this.selectDateElement($dateTd);
    }
  }

  initListeners() {
    const {
      $simplepicker, $timeInput,
      $ok, $cancel, $simplepickerWrapper
    } = this;
    const _this = this;
    $simplepicker.addEventListener('click', function (e) {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();

      e.stopPropagation();
      if (tagName === 'td') {
        _this.selectDateElement(target);
        return;
      }

      if (tagName === 'button' &&
          target.classList.contains('simplepicker-icon')) {
        _this.handleIconButtonClick(target);
        return;
      }
    });

    $timeInput.addEventListener('input', (e: any) => {
      if (e.target.value === '') {
        return;
      }

      const formattedTime = dateUtil.formatTimeFromInputElement(e.target.value);
      _this.$time.innerHTML = formattedTime;
      _this.updateSelectedDate();
    });

    $ok.addEventListener('click', function () {
      _this.close();
      _this.callEvent('submit', function (func) {
        func(_this.selectedDate, _this.readableDate);
      });
    });

    function close() {
      _this.close();
      _this.callEvent('close', function (f) { f() });
    };

    $cancel.addEventListener('click', close);
    $simplepickerWrapper.addEventListener('click', close);
  }

  callEvent(event: SimplePickerEvent, dispatcher: (a: HandlerFunction) => void) {
    const listeners = this._eventHandlers[event] || [];
    listeners.forEach(function (func: HandlerFunction) {
      dispatcher(func);
    });
  }

  open() {
    this.$simplepickerWrapper.classList.add('active');
  }

  // can be called by user or by click the cancel btn.
  close() {
    this.$simplepickerWrapper.classList.remove('active');
  }

  on(event: SimplePickerEvent, handler: HandlerFunction) {
    const { _validOnListeners, _eventHandlers } = this;
    if (!_validOnListeners.includes(event)) {
      throw new Error('Not a valid event!');
    }

    _eventHandlers[event] = _eventHandlers[event] || [];
    _eventHandlers[event].push(handler);
  }

  toogleDisplayFade() {
    this.$time.classList.toggle('simplepicker-fade');
    this.$displayDateElements.forEach($el => {
      $el.classList.toggle('simplepicker-fade');
    });
  }
}

export = SimplePicker;
