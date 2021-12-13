export const isWithinAHundredMeters = (
  currentLatitude,
  addressLatitude,
  currentLongitude,
  addressLongitude,
) => {
  const isHundredMetersNorthOrSouth =
    Math.abs(currentLatitude - addressLatitude) <= (360 * 0.1) / 40075.04; // latitude formula where 0.1 is the distance in km
  const isHundredMetersEastOrWest =
    Math.abs(currentLongitude - addressLongitude) <=
    Math.abs((360 * 0.1) / (40075.04 * Math.cos(currentLatitude)));
  return isHundredMetersNorthOrSouth && isHundredMetersEastOrWest;
};
