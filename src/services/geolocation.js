const options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000};

const getCurrentPosition = new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve(position);
    },
    (error) => {
      reject(error);
    },
    options
  )
});

export default geolocation = {
  getCurrentPosition
};