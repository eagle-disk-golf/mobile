// implementation based on this example
// https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates#365853
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


export const createSquareInMetersFromCoordinate = (location, radius = 5) => {
  // https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters

  //If your displacements aren't too great (less than a few kilometers) and you're not right at the poles,
  //use the quick and dirty estimate that 111,111 meters (111.111 km) in the y direction is 1 degree (of latitude)
  // and 111,111 * cos(latitude) meters in the x direction is 1 degree (of longitude).
  const offsetInMeters = 111111;
  const createLatitude = _ => radius / offsetInMeters;
  const createLongitude = latitude => (radius / offsetInMeters) * Math.cos(latitude);

  const getPoint = index => {
    if (index === 0) {
      const latitude = location.latitude + createLatitude();
      const longitude = location.longitude + createLongitude(latitude);
      return {latitude, longitude};
    }

    if (index === 1) {
      const latitude = location.latitude + createLatitude();
      const longitude = location.longitude - createLongitude(latitude);
      return {latitude, longitude};
    }

    if (index === 2) {
      const latitude = location.latitude - createLatitude();
      const longitude = location.longitude - createLongitude(latitude);
      return {latitude, longitude};
    }

    if (index == 3) {
      const latitude = location.latitude - createLatitude();
      const longitude = location.longitude + createLongitude(latitude);
      return {latitude, longitude};
    }
  };

  return [getPoint(0), getPoint(1), getPoint(2), getPoint(3)];
};
