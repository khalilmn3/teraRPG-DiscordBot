import queryData from "./query.js";

function setCooldowns(playerId, command) {
    let time = new Date();
    let inTime = Math.floor(time.getTime() / 1000);
    let field = '';
    if (command === 'explore') {
        field = 'explore'
    } else if (command === 'work') {
        field = 'work'
    } else if (command === 'fish') {
        field = 'fish'  
    } else if (command === 'vote') {
        field = 'vote'
    } else if (command === 'hourly') {
        field = 'hourly'
    } else if (command === 'daily') {
        field = 'daily'
    } else if (command === 'weekly') {
        field = 'weekly'
    } else if (command === 'junken') {
        field = 'junken'
    } else if (command === 'dungeon') {
        field = 'dungeon'
    }
    queryData(`INSERT cooldowns SET player_id="${playerId}", ${field}="${inTime}", timestamp=NOW() ON DUPLICATE KEY UPDATE ${field}="${inTime}"`);
}

export default setCooldowns;