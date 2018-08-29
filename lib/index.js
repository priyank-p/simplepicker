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
  $date.innerHTML = date.getDate();
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

function handleIconButtonClick(el) {
  const baseClass = 'simplepicker-icon-';
  const nextIcon = baseClass + 'next';
  const previousIcon = baseClass + 'previous';
  if (el.classList.contains(nextIcon)) {
    render(dateUtil.scrapeNextMonth());
  }

  if (el.classList.contains(previousIcon)) {
    render(dateUtil.scrapePreviousMonth());
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

// render current month in advance!
render(dateUtil.scrapeMonth(today));

// find the todays date and select it.
let $todayEl;
const todaysDate = today.getDate().toString();
$tds.forEach((td) => {
  if (td.innerHTML.trim() === todaysDate) {
    $todayEl = td;
  }
});

updateDateComponents(today);
selectDate($todayEl);
