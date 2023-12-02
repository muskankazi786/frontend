export const changeTimeToTwelveHourFormat = (time: string) => {
  let timeValue;
  const am = "AM";
  const pm = "PM";
  const splittedTime = time.split(":");
  const hourInt = parseInt(splittedTime[0]);
  const isZeroMinutes = splittedTime[1] === "00";
  if (hourInt === 0) {
    return (timeValue = `12${isZeroMinutes ? "" : ":"}${
      isZeroMinutes ? "" : splittedTime[1]
    } ${am}`);
  } else if (hourInt > 0 && hourInt < 12) {
    return (timeValue = `${hourInt.toString()}${isZeroMinutes ? "" : ":"}${
      isZeroMinutes ? "" : splittedTime[1]
    } ${am}`);
  } else if (hourInt === 12) {
    return (timeValue = `${splittedTime[0]}${isZeroMinutes ? "" : ":"}${
      isZeroMinutes ? "" : splittedTime[1]
    } ${pm}`);
  } else if (hourInt > 12 && hourInt < 24) {
    const hour = hourInt - 12;
    return (timeValue = `${hour.toString()}${isZeroMinutes ? "" : ":"}${
      isZeroMinutes ? "" : splittedTime[1]
    } ${pm}`);
  }
};
