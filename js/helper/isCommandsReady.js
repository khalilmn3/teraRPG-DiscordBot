import queryData from "./query.js";

async function isCommandsReady(playerId, commands, zone) {
    let field = '';
    let timeLimit = '';
    let timeCooldowns = 0;
    let currentTime = new Date().getTime() / 1000;
    if (commands === 'explore') {
        field = 'explore'
        timeLimit = 60
    } else if (commands === 'work') {
        field = 'work'
        timeLimit = 300
    } else if (commands === 'vote') {
        field = 'vote'
        timeLimit = 43200
    } else if (commands === 'hourly') {
        field = 'hourly'
        timeLimit = 3600
    } else if (commands === 'daily') {
        field = 'daily'
        timeLimit = 86400
    } else if (commands === 'weekly') {
        field = 'weekly'
        timeLimit = 604800
    }
    let lastTime = await queryData(`SELECT ${field} FROM cooldowns WHERE player_id="${playerId}" LIMIT 1`);
    console.log(lastTime);
    if (lastTime.length > 0) {
        lastTime = lastTime[0][field]
    } else {
        lastTime = 0;
    }
    timeCooldowns = Math.round(currentTime - lastTime);
    let waitingTime = secondsToDHms(timeLimit - timeCooldowns);
    return {
        isReady: timeCooldowns > timeLimit,
        currentTime,
        lastTime,
        timeCooldowns,
        waitingTime
    }
}

function secondsToDHms(second) {
    second = Number(second);
    let d = Math.floor(second / 86400);
    let h = Math.floor(second % 86400 / 3600);
    let m = Math.floor(second % 3600 / 60);
    let s = Math.floor(second % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") + (h > 0  || m > 0 || s > 0 ? ", " : "") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay +  hDisplay + mDisplay + sDisplay; 
}
function secondsToHms(d) {
    d = Number(d); var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay + sDisplay;
}

export default isCommandsReady;