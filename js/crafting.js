import queryData from "./helper/query.js";

const furnaceId = '171';
const workbenchId = '170';
const anvilId = '173';
const copperBarId = '22';
const ironBarId = '24';
const copperOreId = '1';
const ironOreId = '3';
const silverOreId = '5';
const silverBarId = '26';
const tungstenOreId = '6';
const tungstenBarId = '27';
const goldOreId = '7';
const goldBarId = '28';
const platinumOreId = '8';
const platinumBarId = '30';
let date = new Date();

async function crafting(message, args1, args2, args3) {
    const id = message.author.id;
    const username = message.author.username;
    const avatar = message.author.avatar;
    if (args1 === 'work' && args2 === 'bench') {
        let existTools = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${id}" AND item_id_work_bench="170" LIMIT 1`);
        console.log(existTools);
        if (existTools.length > 0) {
            message.reply(`you already had this item in your workspace`);
        } else {
            let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE item_id="179" AND player_id="${id}" AND quantity>="10"`);
            if (existMaterials.length > 0) {
                queryData(`UPDATE tools SET item_id_work_bench="170" WHERE player_id="${id}"`)
                queryData(`UPDATE backpack SET quantity=quantity-10 WHERE player_id="${id}" AND item_id="179"`)
                message.channel.send(`**${message.author.username}** has successfully crafted <:Work_Bench:804145756918775828> **${args1} ${args2}**`)
            } else {
                message.reply(`you don't have enough materials to craft <:Work_Bench:804145756918775828> **${args1} ${args2}**,\ngo work and get the materials it need!`)

                // TODO Check material required
                // message.channel.send(new Discord.MessageEmbed({
                //     "type": "rich",
                //     "title": null,
                //     "description": null,
                //     "url": null,
                //     "color": 10115509,
                //     "timestamp": null,
                //     "fields": [{
                //         "value": `:white_check_mark: Wood x10`,
                //         "name": "Materials required (Work Bench)",
                //         "inline": true
                //     }],
                //     "thumbnail": null,
                //     "image": null,
                //     "video": null,
                //     "author": null,
                //     "provider": null,
                //     "footer": {
                //         text: `${username} | Today at ${date.getHours()}:${date.getMinutes()}`
                //     },
                //     "files": []
                // }))
            }
        }
    } else if (args1 === 'furnace') {
        let existTools = await queryData(`SELECT item_id_furnace FROM tools WHERE player_id="${id}" AND item_id_furnace="171" LIMIT 1`);
        if (existTools.length > 0) {
            message.reply(`you already had this item in your workspace`);
        } else {
            let existWorkbench = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${id}" AND item_id_work_bench="170" LIMIT 1`);
            if (existWorkbench.length > 0) {
                let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${id}" AND ((item_id="179" AND quantity>="7") OR (item_id="1" AND quantity>="10"))`);
                if (existMaterials.length > 1) {
                    queryData(`UPDATE tools SET item_id_furnace="171" WHERE player_id="${id}"`)
                    queryData(`UPDATE backpack SET quantity=quantity-7 WHERE player_id="${id}" AND item_id="171"`)
                    queryData(`UPDATE backpack SET quantity=quantity-10 WHERE player_id="${id}" AND item_id="1"`)
                    message.channel.send(`**${message.author.username}** has successfully crafted <:Furnace:804145327513796688> **${args1}**`)
                } else {
                    message.reply(`you don't have enough materials to craft <:Furnace:804145327513796688> **${args1}**,\ngo work and get the materials it need`)
                }
            } else {
                message.reply(`:no_entry_sign: | you need <:Work_Bench:804145756918775828> **work bench** to craft this item.`)
            }
        }
    } else if (args1 === 'anvil') {
        let existTools = await queryData(`SELECT item_id_anvil FROM tools WHERE player_id="${id}" AND item_id_anvil="173" LIMIT 1`);
        if (existTools.length > 0) {
            message.reply(`you already had this item in your workspace`);
        } else {
            let existWorkbench = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${id}" AND item_id_work_bench="170" LIMIT 1`);
            if (existWorkbench.length > 0) {
                let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${id}" AND item_id="24" AND quantity>="5"`);
                if (existMaterials.length > 0) {
                    queryData(`UPDATE tools SET item_id_anvil="173" WHERE player_id="${id}"`)
                    queryData(`UPDATE backpack SET quantity=quantity-5 WHERE player_id="${id}" AND item_id="24"`)
                    message.channel.send(`**${message.author.username}** has successfully crafted <:Iron_Anvil:804145327435284500> **${args1}**`)
                } else {
                    message.reply(`you don't have enough materials to craft <:Iron_Anvil:804145327435284500> **${args1}**,\ngo work and get the materials it need`)
                }
            } else {
                message.reply(`:no_entry_sign: | you need <:Work_Bench:804145756918775828> **work bench** to craft this item.`)
            }
        }

        // Craft Bar
    } else if (args1 === 'copper' && args2 === 'bar') {
        craftBar(message, id, username, copperBarId, copperOreId, '<:Copper_Bar:803907956478836817>', args1, args2, args3);
    } else if (args1 === 'iron' && args2 === 'bar') {
        craftBar(message, id, username, ironBarId, ironOreId, '<:Iron_Bar:803907956528906241>', args1, args2, args3);
    } else if (args1 === 'silver' && args2 === 'bar') {
        craftBar(message, id, username, silverBarId, silverOreId, '<:Silver_Bar:803907956663910410>', args1, args2, args3);
    } else if (args1 === 'tungsten' && args2 === 'bar') {
        craftBar(message, id, username, tungstenBarId, tungstenOreId, '<:Tungsten_Bar:803907956252344331>', args1, args2, args3);
    } else if (args1 === 'gold' && args2 === 'bar') {
        craftBar(message, id, username, goldBarId, goldOreId, '<:Gold_Bar:803907956424441856>', args1, args2, args3);
    } else if (args1 === 'platinum' && args2 === 'bar') {
        craftBar(message, id, username, platinumBarId, platinumOreId, '<:Platinum_Bar:803907956327317524>', args1, args2, args3);
    }
}


async function craftBar(message,playerId,username, itemIdCrafted, itemIdMaterial, emoji,  args1, args2, args3) {
    let existWorkbench = await queryData(`SELECT item_id_furnace FROM tools WHERE player_id="${playerId}" AND item_id_furnace="${furnaceId}" LIMIT 1`);
        let qty = 1;
        if (parseInt(args3) > 0) {
            qty = parseInt(args3);
        }
        let materialsReq = qty * 10;
        if (existWorkbench.length > 0) {
            let existMaterials = await queryData(`SELECT item_id, quantity FROM backpack WHERE player_id="${playerId}" AND item_id="${itemIdMaterial}" AND quantity>="${materialsReq}"`);
            if (existMaterials.length > 0) {
                if (args3 === 'all') {
                    qty = await existMaterials[0].quantity / 10;
                    materialsReq = qty * 10;
                }
                let amount = await queryData(`CALL insert_item_backpack_procedure("${playerId}", "${itemIdCrafted}", "${qty}")`);
                amount = amount.length > 0 ? amount[0][0]['@qty'] : 0;
                queryData(`UPDATE backpack SET quantity=quantity-${materialsReq} WHERE player_id="${playerId}" AND item_id="${itemIdMaterial}"`)
                message.channel.send(`<:Furnace:804145327513796688> | **${username}** has successfully crafted x${qty} ${emoji} **${args1} ${args2}**, \nYou now have x${amount} ${emoji} **${args1} ${args2}** in your backpack`)
            } else {
                message.reply(`:no_entry_sign: | you don't have enough materials to craft x${qty} ${emoji} **${args1} ${args2}**,\ngo work and get the materials it need, you can also check crafter material receipts with \`tera craft\`!`)
            }
        } else {
            message.reply(`:no_entry_sign: | you need <:Furnace:804145327513796688> **furnace** to craft this item!`)
        }
}
export default crafting