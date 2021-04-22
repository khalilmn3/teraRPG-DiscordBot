import agenda from "../helper/agenda.js";
import queryData from "../helper/query.js";

async function booster(message, args) {

    if (args[0] === 'global') {
        if (args[1] === 'exp') {
            if (!isNaN(args[2])) {
                // queryData(`SELECT * FROM booster WHERE player_id=${message.author.id} AND is_global=1 AND booster_type=2`)
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=2 LIMIT 1`);
                message.delete();
                message.channel.send(`Global exp booster is setup to ${args[2]}%`);
                if (args[2] > 0 && args[3] && args[4]) {
                    boosterExpire(message, 'globalEXP', 2, `${args[3]} ${args[4]}`)
                }
            }
        } else if (args[1] === 'gold') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=4 LIMIT 1`);
                message.delete();
                message.channel.send(`Global gold booster is setup to ${args[2]}%`);
                if (args[2] > 0 && args[3] && args[4]) {
                    boosterExpire(message, 'globalGold', 4, `${args[3]} ${args[4]}`)
                }
            }
        }
    } else if (args[0] === 'server') {
        if (args[1] === 'exp') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=3 LIMIT 1`);
                message.delete();
                message.channel.send(`Server exp booster is setup to ${args[2]}%`);
                if (args[2] > 0 && args[3] && args[4]) {
                    boosterExpire(message, 'serverEXP', 3, `${args[3]} ${args[4]}`)
                }
            }
        } else if (args[1] === 'gold') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=5 LIMIT 1`);
                message.delete();
                message.channel.send(`Server gold booster is setup to ${args[2]}%`);
                if (args[2] > 0 && args[3] && args[4]) {
                    boosterExpire(message, 'serverGold', 5, `${args[3]} ${args[4]}`)
                }
            }
        }
    } 
}

async function boosterExpire(message, command, id, time) {
    agenda.define(`${command} ${message.author.id}`, async job => {
        queryData(`UPDATE configuration SET value=0 WHERE id=${id} LIMIT 1`);
    });

    await agenda.start();
    await agenda.cancel({ name: `${command} ${message.author.id}` });
    await agenda.schedule(time, `${command} ${message.author.id}`);
}

export default booster;