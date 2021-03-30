import queryData from "../helper/query.js";

function booster(message, args) {
    if (args[0] === 'global') {
        if (args[1] === 'exp') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=2 LIMIT 1`);
                message.delete();
                message.channel.send(`Global exp booster is setup to ${args[2]}%`);
            }
        } else if (args[1] === 'gold') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=4 LIMIT 1`);
                message.delete();
                message.channel.send(`Global gold booster is setup to ${args[2]}%`);
            }
        }
    } else if (args[0] === 'server') {
        if (args[1] === 'exp') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=3 LIMIT 1`);
                message.delete();
                message.channel.send(`Server exp booster is setup to ${args[2]}%`);
            }
        } else if (args[1] === 'gold') {
            if (!isNaN(args[2])) {
                queryData(`UPDATE configuration SET value=${args[2]} WHERE id=5 LIMIT 1`);
                message.delete();
                message.channel.send(`Server gold booster is setup to ${args[2]}%`);
            }
        }
    } 
}

export default booster;