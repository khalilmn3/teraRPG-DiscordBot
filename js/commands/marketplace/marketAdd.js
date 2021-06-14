import currencyFormat from "../../helper/currency.js";
import queryData from "../../helper/query.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketAdd(message, args, commandBody, stat) {
    let argument = commandBody;
    let arrayPrice = argument.match(/\d+/g);
    let arrayName = argument.match(/[a-zA-Z]+/g);
    arrayName = arrayName.splice(2);
    if (args[0] === 'add') {
        if (stat.level < 5) { return message.channel.send(`${emojiCharacter.noEntry} | Level 5+ is required to use this command!`) };
        if (!arrayName.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide the item name!\n${emojiCharacter.blank} usage \`tera marketplace add [item name] [price]\``) };
        if (!arrayPrice) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide the price!\n${emojiCharacter.blank} usage \`tera marketplace add [item name] [price]\``) }
        let itemName = '';
        let price = parseInt(arrayPrice[0]);
        if(price > 10000000000) { return message.channel.send(`${emojiCharacter.noEntry} | The price cannot be greater than 10.000.000.000!`) }
        if(price <= 0){ return message.channel.send(`${emojiCharacter.noEntry} | You cannot list item with zero price!`) }
        arrayName.forEach(element => {
            if (itemName) {
                itemName += ' ';
            }
            itemName += element;
        });

        let cekItem = await queryData(`SELECT item.id, item.item_group_id, item.type_id, item.emoji, item.name, item.is_tradeable, IFNULL(backpack.quantity,0) as quantity FROM item 
            LEFT JOIN backpack ON (item.id = backpack.item_id)
            WHERE backpack.player_id=${message.author.id} AND item.name="${itemName}" LIMIT 1`);
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
            // Cek item if Equipment
            let armory = await queryData(`SELECT
                armory2.id, item.emoji, armory2.item_id, armory2.modifier_id,
                IF(item.type_id=9, IFNULL(weapon.level_required,0), IFNULL(armor.level_required,0)) as level,
                ROUND(IF(item.type_id=9,IFNULL(weapon.attack,0), IFNULL(armor.def,0))  +  IF(item.type_id=9,(IFNULL(weapon.attack,0) * IFNULL(modifier.stat_change,0)), IFNULL(modifier.stat_change,0))) as stat,
                TRIM(CONCAT(IFNULL(modifier.name,"")," ",item.name)) as name, item_types.id as type_id
                FROM armory2
                LEFT JOIN item ON (armory2.item_id=item.id)
                LEFT JOIN item_types ON (item.type_id=item_types.id)
                LEFT JOIN weapon ON (armory2.item_id=weapon.item_id)
                LEFT JOIN armor ON (armory2.item_id=armor.item_id)
                LEFT JOIN modifier ON (armory2.modifier_id=modifier.id)
                WHERE player_id=${message.author.id}
                AND TRIM(CONCAT(IFNULL(modifier.name,"")," ",item.name)) LIKE "${itemName}" LIMIT 1`)
            armory = armory ? armory[0] : undefined;
            
            if (!armory) { return message.channel.send(`${emojiCharacter.noEntry} | You don't have this item!`) };
            
            // Listing the item on market
            queryData(`INSERT marketplace SET guild_id=${message.guild.id}, player_id=${message.author.id}, item_id=${armory.item_id}, modifier_id=${armory.modifier_id}, price=${price}`)
           // remove item from armory
            queryData(`DELETE FROM armory2 WHERE player_id=${message.author.id} AND id=${armory.id}`);
            
            message.channel.send(`**${message.author.username}** has listing ${armory.emoji}**${armory.name}** •${emojiCharacter.gold2}__${currencyFormat(price)}__ into the marketplace.`);
        }
    }
}

export default marketAdd;