import Geolocation from 'react-native-geolocation-service';
// if physical android device, set => gps location mode: battery saving
const options = {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000};

const getCurrentPosition = _ => new Promise((resolve, reject) => {
  Geolocation.getCurrentPosition(
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
