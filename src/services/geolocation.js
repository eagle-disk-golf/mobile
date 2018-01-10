// if physical device, set => gps location mode: battery saving
const options = {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000};

const getCurrentPosition = _ => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve(position);
    },
    (error) => {
      reject(error);
    },
    options
  );
});

export default geolocation = {
  getCurrentPosition
};
