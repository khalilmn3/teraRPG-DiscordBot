import queryData from "./helper/query.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";

async function sellItem(message, itemName) {
    let args = itemName.split(' ');
    let value = 1;
    if (parseInt(args[1]) > 0) {
        value = args[1];
        itemName = args[0];
    } else if (parseInt(args[2]) > 0) {
        value = args[2];
        itemName = `${args[0]} ${args[1]}`;
    } else if (parseInt(args[3]) > 0) {
        value = args[3];
        itemName = `${args[0]} ${args[1]} ${args[2]}`;
    } else if (args.length > 1 &&  args[1].toString().toUpperCase() === 'ALL') {
        value = args[1].toUpperCase();
        itemName = args[0];
    } else if (args.length > 2 && args[2].toString().toUpperCase() === 'ALL') {
        value = args[2].toUpperCase();
        itemName = `${args[0]} ${args[1]}`;
    } else if (args.length > 3 && args[3].toString().toUpperCase() === 'ALL') {
        value = args[3].toUpperCase();
        itemName = `${args[0]} ${args[1]} ${args[2]}`;
    }

    let itemExist = await queryData(`
        SELECT 
            a.name, a.sell_price,
            b.quantity, b.item_id 
        FROM
            item a 
            LEFT JOIN 
            (SELECT 
                c.item_id, c.quantity
            FROM
                backpack c 
                LEFT JOIN backpack d 
                ON c.item_id = d.item_id
            WHERE d.player_id = "${message.author.id}" AND d.quantity >= ${value == "ALL" ? 1 : value}) b 
            ON a.id = b.item_id 
        WHERE a.name = "${itemName}" LIMIT 1`);
    // console.log(itemExist)
    // console.log(value)
    if (itemExist.length > 0) {
        if (itemExist[0].sell_price > 0) {
            if (itemExist[0].quantity >= value || (value === 'ALL' && itemExist[0].quantity > 0)) {
                if (value === 'ALL') { value = itemExist[0].quantity }
                let totalPrice = value * itemExist[0].sell_price
                let filter = m => m.author.id === message.author.id
                activeCommand(message.author.id);
                await message.reply(`Are you sure to sell x${value} **${itemName}** for **${totalPrice}** gold? \`YES\` / \`NO\``).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first();
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                queryData(`UPDATE backpack SET quantity = quantity - ${value} WHERE player_id="${message.author.id}" AND item_id="${itemExist[0].item_id}" LIMIT 1`);
                                queryData(`UPDATE stat SET gold= gold + ${totalPrice} WHERE player_id="${message.author.id}" LIMIT 1`);
                                message.channel.send(`**${message.author.username}** sold x${value} **${itemName}** for **${totalPrice}** gold`)
                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                message.channel.send(`Terminated`);
                            } else {
                                message.channel.send(`Terminated: Invalid Response`);
                            }
                            deactiveCommand(message.author.id)
                        })
                        .catch(collected => {
                            deactiveCommand(message.author.id)
                            message.channel.send('Timeout, transaction cancelled');
                        });
                })
            } else {
                message.reply(`You dont have that much **${itemName}** in your backpack`);
            }
        } else {
            message.reply(`you can't sell this item`)
        }
    } else {
        message.reply(`what are you trying to sell?`);
    }
}

export default sellItem;