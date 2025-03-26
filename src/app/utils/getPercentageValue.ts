

const getPercentageValue = async (value:number, percent:number) => {
    const result = (percent/100) * value;
    return result;
}

export default getPercentageValue;