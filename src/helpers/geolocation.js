// implementation based on this example
//https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates#365853
const degreesToRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

export const getDistanceInMetersBetweenCoordinates = (startingLocation, endingLocation) => {
  if (!!startingLocation && !!startingLocation.longitude
    && !!startingLocation.latitude
    && !!endingLocation
    && !!endingLocation.latitude
    && !!endingLocation.longitude) {
    // const earthRadiusKm = 6371;
    const earthRadiusInMeters = 6371000;
    const dLat = degreesToRadians(endingLocation.latitude - startingLocation.latitude);
    const dLon = degreesToRadians(endingLocation.longitude - startingLocation.longitude);

    const lat1 = degreesToRadians(startingLocation.latitude);
    const lat2 = degreesToRadians(endingLocation.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // return earthRadiusKm * c;
    return Math.round(earthRadiusInMeters * c);
  }
    return 0;
};
