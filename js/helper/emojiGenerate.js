function generateHPEmoji(current, max, isHp) {
    let point = Math.round((current / max) * 10);
    point = point < 1 && point > 0 ? 1 : point;
    let lost = 10 - point;
    let pointEmoji = ''
    let lostEmoji = ''
    for (let index = 0; index < point; index++) {
        if (index == 0) { // start
            pointEmoji += isHp ? '<:a1:831153136848732251>' : '🟦';
        } else if(index == 9){ //end
            pointEmoji += isHp ? '<:a3:831153136856334376>' : '🟦';
        } else { // middle
            pointEmoji += isHp ? '<:a2:831151213223477289>' : '🟦';
        }
    }
    for (let index = 0; index < lost; index++) {
        if (index == 0 && lost == 10) {
            lostEmoji += isHp ? '<:b1:831153136860790805>' : '⬜';    
        } else if (index == (lost - 1)) {
            lostEmoji += isHp ? '<:b3:831153136454205451>' : '⬜';    
        } else {
            lostEmoji += isHp ? '<:b2:831153136823435335>' : '⬜';    
        }
    }
    return pointEmoji + lostEmoji;
}

export default generateHPEmoji;