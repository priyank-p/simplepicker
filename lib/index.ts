import * as dateUtil from './date-util';
import { htmlTemplate } from './template';

type SimplePickerEvent = 'submit' | 'close';
interface SimplePickerOpts {
    zIndex?: number;
    compactMode?: boolean;
    disableTimeSection?: boolean;
    selectedDate?: Date;
}

type HandlerFunction = (...args: any[]) => void;
interface EventHandlers {
  [key: string]: HandlerFunction[];
}

const today = new Date();
class SimplePicker {
  selectedDate: Date;
  $simplePicker: HTMLElement;
  readableDate: string;
  _eventHandlers: EventHandlers;
  _validOnListeners: string[];

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

  constructor(elOrOpts?: SimplePickerOpts | string | HTMLElement, opts?: SimplePickerOpts) {
    let el: HTMLElement | string | undefined;
        if (typeof elOrOpts === 'string') {
            el = elOrOpts as string;
        } else if (typeof elOrOpts === 'object') {
      opts = elOrOpts as SimplePickerOpts;
    }

    el = el || 'body';
    if (typeof el === 'string') {
      el = document.querySelector(el) as HTMLElement;
    }

    if (!el) {
      throw new Error('SimplePicker: Valid selector or element must be passed!');
    }

    if (!opts) {
      opts = {};
    }

    this.$simplepicker = el;
    this.initElMethod(el);
    this.injectTemplate();
    this.init(opts);
    this.initListeners();

    this._eventHandlers = {};
    this._validOnListeners = [
      'submit',
      'close',
    ];
  }

  // We use $, $$ as helper method to conviently select
  // element we need for simplepicker.
  // Also, Limit the query to the wrapper class to avoid
  // selecting elements on the other instance.
  initElMethod(el) {
    this.$ = (sel) => el.querySelector(sel);
    this.$$ = (sel) => el.querySelectorAll(sel);
  }

  init(opts: SimplePickerOpts) {
    const { $, $$ } = this;

    this.$simplepicker = $('.simpilepicker-date-picker');
    this.$simplepickerWrapper = $('.simplepicker-wrapper');
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

    opts = opts || {};
    this.opts = opts;

    this.reset(this.opts.selectedDate);

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
    reset(selectedDate?: Date) {
        let dte;
        if (selectedDate == undefined) {
            dte = new Date();
        } else {
            dte = selectedDate;
        }
        this.selectedDate = dte;
        this.render(dateUtil.scrapeMonth(this.selectedDate));
        const dtesDate = dte.getDate().toString();
        const $dteEl = this.findElementWithDate(dtesDate);
        if (!$dteEl.classList.contains('active')) {
            this.selectDateElement($dteEl);
            this.updateDateComponents(dte);
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

  injectTemplate() {
    const $template = document.createElement('template');
    $template.innerHTML = htmlTemplate;
    this.$simplepicker.appendChild($template.content.cloneNode(true));
  }

  clearRows() {
    this.$tds.forEach((td) => {
      td.innerHTML = '';
      td.classList.remove('active');
    });
  }

  pad(n, width) {
    n = n + '';
    return n.length >= width ? n :
        new Array(width - n.length + 1).join('0') + n;
  }

  getFormattedTime(dte) {
      let hours = dte.getHours();
      let minutes = dte.getMinutes();
      let meridium = 'AM';

      if (hours > 12) {
          meridium = 'PM';
          hours = hours - 12;
      } else if (hours == 12) {
          meridium = 'PM';
      }
      let result = this.pad(hours, 2) + ":" + this.pad(minutes, 2) + " " + meridium;
      return result;
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
    this.$time.innerHTML = this.getFormattedTime(date);
    this.$timeInput.value = this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2);
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
      e.preventDefault();
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

    $ok.addEventListener('click', function (e) {
      _this.close();
      _this.callEvent('submit', function (func) {
        func(_this.selectedDate, _this.readableDate);
      });
      e.preventDefault();
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
