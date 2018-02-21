const getDurationBetweenDates = (start, finish) => {
  // Calculate the difference in milliseconds
  const difference = start - finish;
  // Take out milliseconds
  const difference_seconds = difference / 1000;
  const seconds = Math.floor(difference_seconds % 60);
  // Take out seconds
  let difference_minutes = difference_seconds / 60;
  const minutes = Math.floor(difference_minutes % 60);
  // Take out minutes
  let difference_hours = difference_minutes / 60;
  const hours = Math.floor(difference_hours % 24);
  const days = Math.floor(difference_hours / 24);

  return {seconds, minutes, hours, days};
};

// Formatted date string
const getFormattedDate = (timestamp) => {
  const date = new Date(timestamp);
  const localeDateString = date.toLocaleDateString().split(', ')[0];
  return localeDateString;
};

// Formatted time string
const getFormattedTime = (timestamp) => {
    const date = new Date(timestamp);
    const timeString = date.getHours() + ":" + date.getMinutes();
    return timeString;
};

// Formatted minutes string
const getFormattedMinutes = (timestamp) => {
    const date = new Date(timestamp);
    const minuteString = date.getMinutes() + ":" + date.getSeconds() + " minutes";
    return minuteString;
};

export default {
  getDurationBetweenDates,
  getFormattedDate,
  getFormattedTime,
  getFormattedMinutes
};
