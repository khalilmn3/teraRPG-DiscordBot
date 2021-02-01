function generateIcon(current, max, isHp) {
    let point = Math.round((current / max) * 10);
    point = point < 1 && point > 0 ? 1 : point;
    let lost = 10 - point;
    let pointEmoji = ''
    let lostEmoji = ''
    for (let index = 0; index < point; index++) {
        pointEmoji += isHp ? ':red_square:' : ':blue_square:';
    }
    for (let index = 0; index < lost; index++) {
        lostEmoji += ':white_large_square:';
    }
    return pointEmoji + lostEmoji;
}

export default generateIcon;