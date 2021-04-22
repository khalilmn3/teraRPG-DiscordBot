function getTimeNow() {
    let time = new Date();
    let inTime = Math.floor(time.getTime() / 1000);
    return inTime;
}


function secondsToDHms(second) {
    second = Number(second);
    let d = Math.floor(second / 86400);
    let h = Math.floor(second % 86400 / 3600);
    let m = Math.floor(second % 3600 / 60);
    let s = Math.floor(second % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? "d" : "d") + (h > 0  || m > 0 || s > 0 ? " " : "") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? "h" : "h") + (m > 0 || s > 0 ? " " : "") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? "m" : "m") + (s > 0 ? " " : "") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    return dDisplay +  hDisplay + mDisplay + sDisplay; 
}

export {
    getTimeNow,
    secondsToDHms
}