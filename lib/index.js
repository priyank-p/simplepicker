const dateUtil = require('./date');

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const $simplepicker = $('.simpilepicker-date-picker');
const $trs = $$('.simplepicker-calender tbody tr');
const $tds = $$('.simplepicker-calender tbody td');
const $headerMonthAndYear = $('.simplepicker-month-and-year');
const $monthAndYear = $('.simplepicker-selected-date');
const $date = $('.simplepicker-date');
const $day = $('.simplepicker-day-header');
const $time = $('.simplepicker-time');
const $timeInput = $('.simplepicker-time-section input');

let currentSelectedDate = new Date();

function clearRows() {
  $tds.forEach((td) => td.innerHTML = '');
}

function updateDateComponents(date) {
  const day = dateUtil.days[date.getDay()];
  const month = dateUtil.months[date.getMonth()];
  const year = date.getFullYear();
  const monthAndYear = month + ' ' + year;
  $headerMonthAndYear.innerHTML = monthAndYear;
  $monthAndYear.innerHTML = monthAndYear;
  $day.innerHTML = day;
  $date.innerHTML = dateUtil.getDisplayDate(date);
}

function render(data) {
  const { month, date } = data;

  clearRows();
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

  updateDateComponents(date);
}

function selectDate(el) {
  const _date = el.innerHTML.trim() + '' + $monthAndYear.innerHTML.trim();
  const date = new Date(_date);
  currentSelectedDate = date;

  const alreadyActive = $('.simplepicker-calender tbody .active');
  el.classList.add('active');
  if (alreadyActive) {
    alreadyActive.classList.remove('active');
  }

  updateDateComponents(date);
}

function findElementWithDate(date) {
  let el;
  $tds.forEach((td) => {
    if (td.innerHTML.trim() === date) {
      el = td;
    }
  });

  return el;
}

function handleIconButtonClick(el) {
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
    return;
  }

  let selectedDate;
  const $active = $('.simplepicker-calender td.active');
  if ($active) {
    selectedDate = $active.innerHTML.trim();
  }

  if (el.classList.contains(nextIcon)) {
    render(dateUtil.scrapeNextMonth());
  }

  if (el.classList.contains(previousIcon)) {
    render(dateUtil.scrapePreviousMonth());
  }

  if (selectedDate) {
    const $dateTd = findElementWithDate(selectedDate);
    selectDate($dateTd);
  }
}

$simplepicker.addEventListener('click', function (e) {
  const { target } = e;
  const tagName = target.tagName.toLowerCase();
  
  if (tagName === 'td') {
    selectDate(target);
    return;
  }

  if (tagName === 'button' &&
      target.classList.contains('simplepicker-icon')) {
    handleIconButtonClick(target);
    return;
  }
});

$timeInput.addEventListener('input', function (e) {
  if (e.target.value === '') {
    return;
  }

  $time.innerHTML = dateUtil.formatTimeFromInputElement(e.target.value);
});

// render current month in advance!
render(dateUtil.scrapeMonth(today));

// find the todays date and select it.
const todaysDate = today.getDate().toString();
const $todayEl = findElementWithDate(todaysDate);
selectDate($todayEl);
updateDateComponents(today);
