// Halloween season window: October 1 to October 31 (local time), inclusive.
export function isHalloweenSeason(date = new Date()) {
  return date.getMonth() === 9;
}
