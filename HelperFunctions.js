export const isWithin100Meters = (
  currentLatitude,
  addressLatitude,
  currentLongitude,
  addressLongitude,
) => {
  const is100MetersNorthOrSouth =
    Math.abs(currentLatitude - addressLatitude) <= (360 * 0.1) / 40075.04; // latitude formula where 0.1 is the distance in km
  const is100MetersEastOrWest =
    Math.abs(currentLongitude - addressLongitude) <=
    Math.abs((360 * 0.1) / (40075.04 * Math.cos(currentLatitude)));
  return is100MetersNorthOrSouth && is100MetersEastOrWest;
};

export const askBackgroundPermission = async () => {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
};
