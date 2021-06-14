export default async function cook(message, commandBody) {
    let { itemName, itemQuantity } = parseItemName(commandBody);

    if (itemName === 'coocked fish') {
        let existItem = await queryData(`SELECT * from item 
            LEFT JOIN backpack ON (item.id = backpack.item_id) 
            WHERE backpack.player_id=${message.author.id} item.id = 235 LIMIT 1`)
    } else if (itemName === 'coocked shrimp') {
        
    } else if (itemName === 'sashimi') {
        
    } else if (itemName === 'seafood dinner') {
        
    } else if (itemName === 'lobster tail') {
        
    } else if (itemName === 'rock lobster') {
        
    }
}

function existItem(playerId, itemReq) {
    let existItem = await queryData(`SELECT * from item 
            LEFT JOIN backpack ON (item.id = backpack.item_id)
            WHERE backpack.player_id=${playerId} item.id = 235 
            LIMIT 1`);

    existItem = existItem.length > 0 ? existItem[0] : undefined;

    return existItem;
}