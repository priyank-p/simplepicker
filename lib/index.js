const dateUtil = require('./date-util');
const htmlTemplate = require('./template');

const today = new Date();

class SimplePicker {
  constructor(el, opts) {
    if (typeof el === 'object') {
      opts = el;
      el = undefined;
    }

    el = el || 'body';
    if (typeof el === 'string') {
      el = document.querySelector(el);
    }

    if (!el) {
      throw new Error('SimplePicker: Valid selector or element must be passed!');
    }

    this.selectedDate = new Date();
    this.$simplepicker = el;
    this.initElMethod(el);
    this.injectTemplate(el);
    this.init(opts);
    this.initListeners();

    this._eventHandlers = [];
    this._validOnListeners = [
      'submit',
      'close',
    ];
  }

  // limit the query to the wrapper class to avoid
  // selecting elements on the other instance.
  initElMethod(el) {
    this.$ = (sel) => el.querySelector(sel);
    this.$$ = (sel) => el.querySelectorAll(sel);
  }

  init(opts) {
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
    this.render(dateUtil.scrapeMonth(today));

    // find the todays date and select it.
    const todaysDate = today.getDate().toString();
    const $todayEl = this.findElementWithDate(todaysDate);
    this.selectDate($todayEl);
    this.updateDateComponents(today);

    opts = opts || {};
    if (opts.zIndex !== undefined) {
      this.$simplepickerWrapper.style.zIndex = opts.zIndex;
    }

    if (opts.disableTimeSection) {
      this.disableTimeSection();
    }
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

  updateDateComponents(date) {
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
    const { $trs } = this;
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

    this.updateDateComponents(date);
  }

  updateSelectedDate(el) {
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
    this.readableDate = _date.replace(/^\d+/, date.getDate());
  }

  selectDate(el) {
    const alreadyActive = this.$('.simplepicker-calender tbody .active');
    el.classList.add('active');
    if (alreadyActive) {
      alreadyActive.classList.remove('active');
    }

    this.updateSelectedDate(el);
    this.updateDateComponents(this.selectedDate);
  }

  findElementWithDate(date, returnLastIfNotFound) {
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

  handleIconButtonClick(el) {
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
      this.selectDate($dateTd);
    }
  }

  initListeners() {
    const {
      $simplepicker, $timeInput,
      $ok, $cancel, $simplepickerWrapper
    } = this;
    const _this = this;
    $simplepicker.addEventListener('click', function (e) {
      const { target } = e;
      const tagName = target.tagName.toLowerCase();

      e.stopPropagation();
      if (tagName === 'td') {
        _this.selectDate(target);
        return;
      }

      if (tagName === 'button' &&
          target.classList.contains('simplepicker-icon')) {
        _this.handleIconButtonClick(target);
        return;
      }
    });

    $timeInput.addEventListener('input', function (e) {
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

  callEvent(event, dispatcher) {
    const listeners = this._eventHandlers[event] || [];
    listeners.forEach(function (func) {
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

  on(event, handler) {
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

// window.SimplePicker = SimplePicker;
module.exports = SimplePicker;
