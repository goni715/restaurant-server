
const isValidDate = (value:string) => {
    const dateRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // "2024-11-25"
    return dateRegex.test(value); 
}

export default isValidDate;
