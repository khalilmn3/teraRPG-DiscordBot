import queryData from "../helper/query.js";

async function give(message, args) {
    if (!isNaN(parseInt(args[0])) && !isNaN(parseInt(args[1]))) {
        if (!isNaN(parseInt(args[2])) && args[2].length == 18) {
            let checkUser = await queryData(`SELECT id FROM player WHERE id="${args[2]}" LIMIT 1`);
            if (checkUser.length > 0) {
                let checkItem = await queryData(`SELECT id, emoji, name FROM item WHERE id="${args[0]}" LIMIT 1`);
                if (checkItem.length > 0) {
                    queryData(`CALL insert_item_backpack_procedure(${args[2]}, ${args[0]}, ${args[1]})`);
                    message.channel.send(`${checkItem[0].emoji} x ${args[1]} ➜ <@${args[2]}>`);
                } else {
                    message.reply('Item ID is not listed!');
                }
            } else {
                message.reply('user not registered!');
            }
        } else {
            message.reply('incorrect format ID');
        }
    } else {
        message.channel.send('incorrect argument!');
    }
    message.delete();
}

export default give;