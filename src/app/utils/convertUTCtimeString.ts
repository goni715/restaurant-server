
const convertUTCtimeString = (isoString:string) => {
  const date = new Date(isoString);
  const timeStringUTC = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });

  return timeStringUTC;

  //console.log(timeStringUTC); // Output: "10:00 AM"
}

export default convertUTCtimeString;