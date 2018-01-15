// if physical device, set => gps location mode: battery saving
const options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000};

const getCurrentPosition = _ => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const flattened = {
        ...position.coords,
          timestamp: position.timestamp
      };

      resolve(flattened);
    },
    (error) => {
      const customError = {
        ...error,
        message: 'Cannot read location, please make sure that you have location services available'
      };
      reject(customError);
    },
    options
  );
});

export default {
  getCurrentPosition
};
