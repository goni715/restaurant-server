

const getPercentageValue = (value:number, percent:number) => {
    const result = Math.round((percent/100) * value);
    return result;
}

export default getPercentageValue;