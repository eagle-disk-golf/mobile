/** eslint max-len: 0 */
import Config from 'react-native-config';
const GOOGLE_GEOCODING_PREFIX = 'https://maps.googleapis.com/maps/api/geocode/';

/** Reverse geocoding is the process of converting geographic coordinates into a human-readable address.  */
export const getAddressByCoordinates = location => new Promise((resolve, reject) => {
  const queryString = `${GOOGLE_GEOCODING_PREFIX}json?latlng=${location.latitude},${location.longitude}&key=${Config.GOOGLE_MAPS_API_KEY}`;

  fetch(queryString)
    .then(res => res.json())
    .then((json) => {
      resolve(json);
    }).catch((er) => {
      reject(er);
    });
});

