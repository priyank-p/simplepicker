const monthTracker = {
  years: {}
};

const months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

function fill(arr, upto) {
  arr = [].concat(arr);
  for (let i = 0; i < upto; i++) {
    arr[i] = null;
  }

  return arr;
}

// builds the calender for one month given a date
// which is end, start or in middle of the month
function scrapeMonth(date) {
  const originalDate = new Date(date.getTime());
  const year = date.getFullYear();
  const month = date.getMonth();

  const data = {
    date: originalDate
  };

  monthTracker.current = new Date(date.getTime());
  monthTracker.current.setDate(1);
  monthTracker.years[year] = monthTracker.years[year] || {};
  if (monthTracker.years[year][month] !== undefined) {
    data.month = monthTracker.years[year][month];
    return data;
  }

  date = new Date(date.getTime());
  date.setDate(1);
  monthTracker.years[year][month] = [];

  let tracker = monthTracker.years[year][month];
  let rowTracker = 0;
  while (date.getMonth() === month) {
    const _date = date.getDate();
    const day = date.getDay();
    if (_date === 1) {
      tracker[rowTracker] = fill([], day);
    }

    tracker[rowTracker] = tracker[rowTracker] || [];
    tracker[rowTracker][day] = _date;

    if (day === 6) {
      rowTracker++;
    }

    date.setDate(date.getDate() + 1);
  }

  let lastRow = 5;
  if (tracker[5] === undefined) {
    lastRow = 4;
    tracker[5] = fill([], 7);
  }

  let lastRowLength = tracker[lastRow].length;
  if (lastRowLength < 7) {
    let filled = tracker[lastRow].concat(fill([], 7 - lastRowLength));
    tracker[lastRow] = filled;
  }

  data.month = tracker;
  return data;
}

function scrapePreviousMonth() {
  const date = monthTracker.current;
  date.setMonth(date.getMonth() - 1);
  return scrapeMonth(date);
}

function scrapeNextMonth() {
  const date = monthTracker.current;
  date.setMonth(date.getMonth() + 1);
  return scrapeMonth(date);
}

const dateEndings = {
  st: [1, 21, 31],
  nd: [2, 22],
  rd: [3, 23]
};

function getDisplayDate(_date) {
  const date = _date.getDate();
  if (dateEndings.st.includes(date)) {
    return date + 'st';
  }

  if (dateEndings.nd.includes(date)) {
    return date + 'nd';
  }

  if (dateEndings.rd.includes(date)) {
    return date + 'rd';
  }

  return date + 'th';
}

function formatTimeFromInputElement(input) {
  let timeString = '';
  let [ hour, minute ] = input.split(':');
  hour = +hour;

  const isPM = hour >= 12;
  if (isPM && hour > 12) {
    hour = hour - 12;
  }

  if (!isPM && hour === 0) {
    hour = 12;
  }

  timeString += hour < 10 ? '0' + hour : hour;
  timeString += ':' + minute + ' ';
  timeString += isPM ? 'PM' : 'AM';
  return timeString;
}

module.exports = {
  monthTracker,
  months,
  days,
  scrapeMonth,
  scrapeNextMonth,
  scrapePreviousMonth,
  formatTimeFromInputElement,
  getDisplayDate
};
