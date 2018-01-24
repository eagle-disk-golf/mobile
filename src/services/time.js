const getDurationBetweenDates = (start, finish) => {
  // Calculate the difference in milliseconds
  const difference = start - finish;
  //take out milliseconds
  const difference_seconds = difference / 1000;
  const seconds = Math.floor(difference_seconds % 60);

  let difference_minutes = difference_seconds / 60;
  const minutes = Math.floor(difference_minutes % 60);

  let difference_hours = difference_minutes / 60;
  const hours = Math.floor(difference_hours % 24);
  const days = Math.floor(difference_hours / 24);

  return {seconds, minutes, hours, days};
};

const getFormattedDate = (timestamp) => {
  const date = new Date(timestamp);
  const localeDateString = date.toLocaleDateString().split(', ')[0];
  return localeDateString;
};

export default {
  getDurationBetweenDates,
  getFormattedDate
};
