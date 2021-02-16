function randomNumber(min, max) {
    let number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number
}

export default randomNumber;