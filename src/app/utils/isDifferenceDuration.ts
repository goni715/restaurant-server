
//check if difference between startDateTime & endDateTimeLimit = duration time
//or check if difference between startDateTime & endDateTimeLimit is greater than duration time
function isDifferenceDuration(startDateTimeLimit: any, endDateTimeLimit: any, duration:number) {
    // Convert both dates to timestamps (milliseconds)
    const diffInMs = Math.abs(new Date(endDateTimeLimit) - new Date(startDateTimeLimit));
    console.log(diffInMs);

    // Convert milliseconds to minutes
    const diffInMinutes = diffInMs / (1000 * 60);
    console.log(diffInMinutes);

    return diffInMinutes === duration || diffInMinutes > duration;
}

export default isDifferenceDuration;