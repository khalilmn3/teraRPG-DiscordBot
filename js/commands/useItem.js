import queryData from "../helper/query.js";
import { limitedTimeUse } from "../helper/variable.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import { getTimeNow } from "../utils/utils.js";

async function use(message, commandBody) {
    commandBody = commandBody.slice(4);
    if (commandBody == 'lucky coin') {
        let cekItem = await queryData(`SELECT * FROM backpack WHERE player_id=${message.author.id} AND item_id=${limitedTimeUse.luckyCoinId} AND quantity>0 LIMIT 1`);
        cekItem = cekItem.length > 0 ? cekItem[0] : undefined;
        if (cekItem) {
            // REMOVE THE ITEM FOR USE
            let timeNow = getTimeNow();
            let boosterPercent = 25;
            let time = timeNow + 3600;
            let cekActive = await queryData(`SELECT * FROM booster WHERE player_id=${message.author.id} AND booster_type=1 AND is_global=0 LIMIT 1`);
            cekActive = cekActive.length > 0 ? cekActive[0] : undefined;
            if (cekActive) {
                if (cekActive.time < timeNow) {
                    queryData(`UPDATE backpack SET quantity=quantity-1 WHERE player_id=${message.author.id} AND item_id=${limitedTimeUse.luckyCoinId} LIMIT 1`);
                    queryData(`UPDATE booster SET percent=${boosterPercent}, time=${time} WHERE player_id=${message.author.id} AND booster_type=1 AND is_global=0 LIMIT 1`)

                    message.channel.send(`${limitedTimeUse.luckyCoinEmoji}**Lucky coin** has applied, cek the status on booster`);
                } else {
                    message.channel.send(`${emojiCharacter.noEntry} | You already have active booster, wait it expire before use another one!`)
                }
            } else {
                queryData(`UPDATE backpack SET quantity=quantity-1 WHERE player_id=${message.author.id} AND item_id=${limitedTimeUse.luckyCoinId} LIMIT 1`);
                queryData(`INSERT booster SET player_id=${message.author.id}, booster_type=1, percent=${boosterPercent}, is_global=0, time=${time}`)

                message.channel.send(`${limitedTimeUse.luckyCoinEmoji}**Lucky coin** has applied, cek the status on booster`);
            }
        } else {
            message.channel.send(`${emojiCharacter.noEntry} | You don't have ${limitedTimeUse.luckyCoinEmoji}**Lucky coin**!!!`)
        }
    }
}

export default use;