import currencyFormat from "../../helper/currency.js";
import queryData from "../../helper/query.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketAdd(message, args, commandBody, stat) {
    let argument = commandBody;
    let arrayPrice = argument.match(/\d+/g);
    let arrayName = argument.match(/[a-zA-Z]+/g);
    arrayName = arrayName.splice(2);
    console.log(arrayName);
    if (args[0] === 'add') {
        if (stat.level < 5) { return message.channel.send(`${emojiCharacter.noEntry} | Level 5+ is required to use this command!`) };
        if (!arrayName.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide the item name!\n${emojiCharacter.blank} usage \`tera marketplace add [item name] [price]\``) };
        if (!arrayPrice) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide the price!\n${emojiCharacter.blank} usage \`tera marketplace add [item name] [price]\``) }
        let itemName = '';
        let price = parseInt(arrayPrice[0]);
        if(price <= 0){ return message.channel.send(`${emojiCharacter.noEntry} | You cannot list item with zero price!`) }
        arrayName.forEach(element => {
            if (itemName) {
                itemName += ' ';
            }
            itemName += element;
        });
        
        let cekItem = await queryData(`SELECT item.id, item.emoji, item.name, item.is_tradeable, backpack.quantity FROM item LEFT JOIN backpack ON (item.id = backpack.item_id) WHERE item.name="${itemName}" LIMIT 1`);
        cekItem = cekItem ? cekItem[0] : undefined;

        if (cekItem) {
            if (cekItem.quantity <= 0) { return message.channel.send(`${emojiCharacter.noEntry} | You don't have this item!`) };
            if (!cekItem.is_tradeable) { return message.channel.send(`${emojiCharacter.noEntry} | This item is not tradeable!`) };
            // Cek limit 
            let marketList = await queryData(`SELECT * FROM marketplace WHERE player_id=${message.author.id} LIMIT 5`);
            if (marketList.length >= 5 && message.author.id !== '668740503075815424') { return message.channel.send(`${emojiCharacter.noEntry} | You can't add more than 5 items on marketplace.`) }
            // Listing the item on market
            queryData(`INSERT marketplace SET guild_id=${message.guild.id}, player_id=${message.author.id}, item_id=${cekItem.id}, price=${price}`)
            // Remove item from player backpack
            queryData(`UPDATE backpack SET quantity = quantity - 1 WHERE player_id=${message.author.id} AND item_id=${cekItem.id} LIMIT 1`);
            
            message.channel.send(`**${message.author.username}** has listing ${cekItem.emoji}**${cekItem.name}** •${emojiCharacter.gold2}__${currencyFormat(price)}__ into the marketplace.`);
        } else {
            message.channel.send(`${emojiCharacter.noEntry} | Cannot recognize the item name!`)
        }
    }
}

export default marketAdd;