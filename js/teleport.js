import queryData from "./helper/query.js";

// Command to teleport to specific Zone
async function teleport(message, zone) {
    if (zone.length > 0) {
        let subZone = zone[1] !== undefined && zone[1] > 0 && zone[1] <= 2 ? zone[1] : 1;
        await queryData(`UPDATE stat SET zone_id=${zone[0]}, sub_zone=${subZone} WHERE player_id="${message.author.id}"`)
        message.reply(`:milky_way: Teleported to Zone ${Math.floor(zone[0])}-${subZone}.`)   
    } else {
        message.reply(`please specify which **zone** you want to teleport \n Format \`teleport <zone> <sub_zone>\` \n eg. \`teleport 2 2\` | available zone: 1 - 8 `)
    }
}

export default teleport;