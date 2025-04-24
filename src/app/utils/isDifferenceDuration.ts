function isDifferenceDuration(
    startDateTimeLimit: string | Date,
    endDateTimeLimit: string | Date,
    duration: number
  ): boolean {
    const start = new Date(startDateTimeLimit).getTime();
    const end = new Date(endDateTimeLimit).getTime();
  
    const diffInMinutes = Math.abs(end - start) / (1000 * 60);
  
    return diffInMinutes >= duration;
  }
  
  export default isDifferenceDuration;
  