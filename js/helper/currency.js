function currencyFormat(integer) {
    return integer.toLocaleString('en-US', {maximumFractionDigits:2});
}

export default currencyFormat;