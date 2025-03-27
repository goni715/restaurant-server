
//time = 10:30
const convertUTCTime = (time:string) => {
    
  const currentDay = new Date("2025-01-01T00:00:00.000Z");

  // Parse start and end time as UTC
  const [hour, minute] = time.split(":").map(Number);
  const dataTime = new Date(
    Date.UTC(
      currentDay.getUTCFullYear(),
      currentDay.getUTCMonth(),
      currentDay.getUTCDate(),
      hour,
      minute,
      0
    )
  ); //month is 0-based

  return dataTime;
}