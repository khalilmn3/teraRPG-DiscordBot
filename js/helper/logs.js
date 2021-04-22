import queryData from "./query.js";

function log(message, commands) {
    let d = new Date;
    let datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
        d.getHours() + ":" + d.getMinutes();
    queryData(`UPDATE player SET hit=hit+1 WHERE id="${message.author.id}" LIMIT 1`);
    console.log(`${datestring} | ${message.guild.id} | ${message.author.id} | ${commands}`);
    // queryData(`INSERT logs SET player_id="${message.author.id}", command="${commands}"`);
}

export default log;