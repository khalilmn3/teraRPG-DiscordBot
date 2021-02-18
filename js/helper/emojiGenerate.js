function generateIcon(current, max, isHp) {
    let point = Math.round((current / max) * 10);
    point = point < 1 && point > 0 ? 1 : point;
    let lost = 10 - point;
    let pointEmoji = ''
    let lostEmoji = ''
    for (let index = 0; index < point; index++) {
        pointEmoji += isHp ? '🟩' : '🟦';
    }
    for (let index = 0; index < lost; index++) {
        lostEmoji += isHp ? '🟥' : '⬜';
    }
    return pointEmoji + lostEmoji;
}

export default generateIcon;