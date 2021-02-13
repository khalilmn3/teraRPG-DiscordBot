import queryData from "./query.js";

function setCooldowns(id, command) {
    let time = new Date();
    let inTime = time.getTime();
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
    }
    
    queryData(`INSERT cooldowns SET player_id="${id}", ${field}="${inTime}", timestamp=NOW() ON DUPLICATE KEY UPDATE ${field}="${inTime}"`);
}

export default setCooldowns;