function currencyFormat(integer) {
    if (isNaN(integer) || integer === 0 || integer === null) {
        return 0;
    }
    return integer.toLocaleString('en-US', {maximumFractionDigits:2});
}

export default currencyFormat;