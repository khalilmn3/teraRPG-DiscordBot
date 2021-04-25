import Discord from "discord.js";
import { cooldownMessage } from "../embeddedMessage.js";
import addExpGold from "../helper/addExp.js";
import currencyFormat from "../helper/currency.js";
import { getMaxExp } from "../helper/getBattleStat.js";
import isCommandsReady from "../helper/isCommandsReady.js";
import queryData from "../helper/query.js";
import randomNumber from "../helper/randomNumberWithMinMax.js";
import setCooldowns from "../helper/setCooldowns.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import { updateStat2 } from "../utils/processQuery.js";

async function quest(message, stat) {
    let cooldowns = await isCommandsReady(message.author.id, 'quest');

    let activeQuest = await queryData(`SELECT * FROM active_quest INNER JOIN cfg_quest ON (active_quest.quest_id=cfg_quest.id) WHERE player_id=${message.author.id} AND is_done=0 LIMIT 1`);
    activeQuest = activeQuest.length > 0 ? activeQuest[0] : undefined;
    let field = {};
    let textFooter = '';
        if (activeQuest && activeQuest.required_done >= activeQuest.required) { // if quest is completed
            field = {
                name: `Quest completed`,
                value: `\\📋 | Quest: __${activeQuest.name}__\n\n**Claimed Rewards\\🎁**\n\`+${currencyFormat(activeQuest.gold)}\` <:gold_coin:801440909006209025>\n\`+${currencyFormat(activeQuest.exp)}\` ${emojiCharacter.exp}`,
                inline: true,
            }
            addExpGold(message, message.author, stat, activeQuest.exp, activeQuest.gold, null);
            queryData(`UPDATE active_quest SET is_done=1 WHERE player_id=${message.author.id} LIMIT 1`);
            textFooter = `Done!`

            // UPDATE STAT
            updateStat2(message.author.id, 'quest_completed', '1');
        } else if (activeQuest && !cooldowns.isReady) {
            field = {
                name: `Complete this quest to get rewards`,
                value: `\\📋 | Active quest: __${activeQuest.name}__\n\n**Rewards**\n\`+${currencyFormat(activeQuest.gold)}\` <:gold_coin:801440909006209025>\n\`+${currencyFormat(activeQuest.exp)}\` ${emojiCharacter.exp}`,
                inline: true,
            }
            textFooter = `Progress ${activeQuest.required_done}/${activeQuest.required} | Expires in: ${cooldowns.waitingTime}`
        } else if (cooldowns.isReady) {
            let questList = await queryData(`SELECT * FROM cfg_quest`);
            let randomQuest = randomNumber(0, questList.length - 1);
            questList = questList[randomQuest];
            let maxEXP = getMaxExp(stat.level);
            let expMax = Math.floor(maxEXP * 5 / 100);
            expMax = expMax < 10 ? 10 : expMax;
            let expMin = Math.floor(expMax / 2);
            let goldMax = 1000 * stat.level / 2;
            let goldMin = Math.floor(goldMax / 2);
            let gold = randomNumber(goldMin, goldMax);
            let exp = randomNumber(expMin, expMax);
            field = {
                name: `Complete this quest to get rewards`,
                value: `\\📋 | Active quest: __${questList.name}__\n\n**Rewards**\n\`+${currencyFormat(gold)}\` <:gold_coin:801440909006209025>\n\`+${currencyFormat(exp)}\` ${emojiCharacter.exp}`,
                inline: true,
            }
            textFooter = `Progress 0/${questList.required} | New quest!`
            // INSERT QUEST INTO DATABASE
            queryData(`INSERT active_quest SET player_id=${message.author.id}, quest_id=${questList.id}, gold=${gold}, exp=${exp} ON DUPLICATE KEY UPDATE quest_id=${questList.id}, gold=${gold}, exp=${exp}, is_done=0, required_done=0`);
            setCooldowns(message.author.id, 'quest');
        } else {
            message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Quest', cooldowns.waitingTime));
            return;
        }
    
    let embed = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 1231235,
        fields: [
            field
        ],
        author: {
            "name": `${message.author.username}'s Quest`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        footer: {
            text: `${textFooter}`
        }
    });

    message.channel.send(embed);
}

export default quest;