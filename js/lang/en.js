import { limitedTimeUse } from "../helper/variable.js";

export default {
    rewards : {
        notVote: 'You haven\'t voted yet',
        voted: 'You already voted, \nYou can vote again in',
        moreRewards: `Want to get more rewards?\n[Vote me on here](https://top.gg/bot/804295231838355466/vote)`,
        doubleRewards: 'Rewards are doubled on weekends',
        dailyStreak: 'Claim daily reward for 7 days in a row to get bonus reward.'
    },
    grind: {
        log1:  '**${message.author.username}** explores their mining cave and finds ${monster.emoji} **${monster.name}**,\n preparing for battle...',
        log2 : 'smacked you down, \nyou died and lost a level.',
        log3: 'smacked you down,\n Be more careful next time and make sure \n you are more prepared before going to wild.',
        log4: ' and knocked down',

        logh1: '\n have successfully beaten ${monster.emoji}**${monster.name}\n** with **${weapon}**, current HP __${playerHP}/${playerMaxHP}__',
        logh2: '\n${monster.emoji}**${monster.name}** beat **${message.author.username}** \nyou died and drop a level.',
        logh3: '\n${monster.emoji}**${monster.name}** beat **${message.author.username}** \nyou died and got nothing',
        footer1: 'Booster is active right now, cek with [tera booster]',
        playerAttack: 'swing ${stat.wEmoji} **${stat.weaponName}**` : using 👊**bare hand**',
        turnFooter : 'Note: rewards are based on your mining depth and zone',
    },
    info: {
        infoNotFound: 'Cannot find related info!',
        luckyCoin:{
            name: limitedTimeUse.luckyCoinEmoji+'Lucky coin',
            info: 'Gold booster that gives you 25% more gold \nwhen using \`explore\` and \`mining expedition\`\n - **usage** \`use lucky coin\`',
            obtain: '\`code\`, \`pirates invasion\'s drop\`'
        },
        discountCard: {
            name: limitedTimeUse.dicountCardEmoji+'Discount card',
            info: 'Gives you a 25% discount in the shop, \nit gets consumed when buying things from the shop',
            obtain: '\`code\`, \`pirates invasion\'s drop\`'
        },
        diamond: {
            name: '<:diamond:801441006247084042> Diamond',
            info: 'Currency used for buying items on market',
            obtain: '\`7 daily strike\`, \`vote rewards\`'
        },
        piggyBank: {
            name: '<:piggy_bank:801444684194906142> Piggy bank',
            info: 'Deposit your gold and get an exp boost\ndepending on how much gold is in your bank\n- **usage** \`bank\`,\`deposit\`, \`withdraw\`',
            obtain: '\`market\`'
        },
        miningHelmet: {
            name: '<:Mining_Helmet:824176323194650624> Mining helmet',
            info: 'Grants you ores when using \`mine\`\nbye-bye rock',
            obtain: '\`market\`'
        },
        bugNet: {
            name: '<:Bug_Net:824176322908913687> Bug net',
            info: 'Have a 20% chance to capture bugs when using \`chop\`',
            obtain: '\`market\`'
        },
        pylon: {
            name: '<:Forest_Pylon:826645637788598294> Pylon',
            info: 'Used for teleporting to any discovered \`zone/sub zone\`\n- **Usage**: \`zone\`',
            obtain: '\`market\`'
        },
        healingPotion: {
            name: '<:Healing_Potion:810747622859735100> Healing potion',
            info: 'Restores your HP to max',
            obtain: '\`shop\`, \`vote\`'
        },
        apprenticeBait: {
            name: '<:Apprentice_Bait:824271452056059985> Apprentice bait',
            info: 'Consumed when using \`fish\`, it has 15% bait power',
            obtain: '\`shop\`'
        },
        monarchButterfly: {
            name: '<:Monarch_Butterfly:824268384937312277> Monarch butterfly',
            info: 'Consumed when using \`fish\`, it has 5% bait power',
            obtain: '\`chop\` when you have bug net'
        },
        grasshopper: {
            name: '<:Grasshopper:824268384979779596> Grasshopper',
            info: 'Consumed when using \`fish\`, it has 10% bait power',
            obtain: '\`chop\` when you have bug net'
        },
        blackDragonfly: {
            name: '<:Black_Dragonfly:824268377576702002> Black dragonfly',
            info: 'Consumed when using \`fish\`, it has 15% bait power',
            obtain: '\`chop\` when you have bug net'
        
        },
        ladybug: {
            name: '<:Ladybug:824268377425707048> Ladybug',
            info: 'Consumed when using \`fish\`, it has 20% bait power',
            obtain: '\`chop\` when you have bug net'
        },
        worm: {
            name: '<:Worm:824268370139414529> Worm',
            info: 'Consumed when using \`fish\`, it has 35% bait power',
            obtain: '\`chop\` when you have bug net'
        },
        goldWorm: {
            name: '<:Gold_Worm:824268369876221954> Gold worm',
            info: 'Consumed when using \`fish\`, it has 50% bait power',
            obtain: '\`chop\` when having bug net'
        },
        baitPower: {
            name: 'Bait power',
            info: 'Bait power influences the quality of the catch\nHigher bait powers means higher quality of the catch',
            obtain: '\`bait\`'
        },
        bait: {
            name: 'Bait',
            info: 'Bait is consumed when using \`fish\`, If the player has multiple types of bait in their inventory\nthey are used from the bottom slot of the backpack to the top.',
            obtain: '\`shop\`, \`chop\` when having bug net',
        } ,
        marketplace: {
            name: 'Marketplace',
            info: `A place to buy and sell items on TeraRPG\n\n**Usage**\n**• tera marketplace\n\` Display the list of items on marketplace\`\n• tera marketplace add [item name] [price]*\n\` Sell an item on the marketplace\`\n• tera marketplace buy [id]\n\` Buy an item from the marketplace\`\n• tera marketplace remove [id]\n\` Remove an item you\'re selling from the marketplace\`\n• tera marketplace search [item name]\n\` Search for items on marketplace\`\n• tera marketplace list\n\` Displays the items you\'re selling on marketplace\`\n• tera marketplace @[user]\n\` Display another person\'s items they\'re selling on marketplace\`**`,
            obtain: '*Level 5',
        },
        armory: {
            name: 'Armory',
            info: `Store your equipment here, you can store a maximum of 5 items\nfor each equipment type.\n**Usage**\n**• tera equip [id/name]\n\`equip an item from your armory\`\n• tera unequip [equip type]\n**equip type: \`weapon\`,\`helmet\`,\`shirt\`,\`pants\`\n**• tera sell armory [id]\n\`sell an item from armory\`**`,
            obtain: 'Anywhere',
        }
    },
    pirates: {
        title: 'Pirate invasion',
        arrive: 'The pirates have arrived!\nType \`fight\` to fight the pirates \nget rewards depending on how many players join in',
        alert: 'ALERT!!!',
        piratesApproaches: 'Pirates are approaching from the west!',
        footerAlert: 'Prepare yourself, they are getting close',
        pirateDefeat: 'PIRATES HAS BEEN DEFEATED!',
        piratesNotDefeated: 'Pirates has not been defeated!!!',
        noRewards: 'Nobody got rewards',

    },
    prefix: {
        allowedLength: ' Allowed maximum length of a prefix is 4 characters.',
        setup: 'Prefix has been setup to ',
        dontHavePermission: 'You don\'t have permission to change the bot prefix!',
        invalidCharacter: 'Invalid character',
    },

    quest: {
        startQuest: 'Complete this quest to get rewards',
        questCompleted: 'Quest completed',

    },
    servant: {
        summon: 'Type \`join ${randomNumberParty}\` to help **${message.author.username}**, \nthe more players join in, the higher the chance of winning the fight',
        servantSummoned: '${servants.emoji} ${servants.name} has spawned',
        failed: '\`Slayer/s\`: ${playerJoin ? playerJoin : ' - '} \nFailed to defeat the servant, \ntry again next time with more people',
        failed2: '${servants.emoji}** ${servants.name}** ends up running away',
    },
    smelt: {
        unknown: 'What are you trying to smelt? Correct use is \`tera smelt [item bar] [amount]\`\n e.g. \`tera smelt iron bar 10\`, smelting will give back 80% of the ore',
        itemNotEnough: ' You don\'t have ${quantity} ${emojiNames} to smelt in your backpack!'
    },
    trade: {
        itemNotEnough: 'Oh dear, I can\'t trade with what you have now',

    },
    equipment: {
        itemNotFound: 'Item not found, please check your armory!',
        lowLevel: 'You are not a high enough level to equip this item.',
        armoryFull: ' armory is full\nyou can only store a maximum of 5 items in your armory for each item type!',
        noEquip: '**${message.author.username}**, you are not wearing *${slotField}*!'
    },
    duel: {
        notResponding: ' is not responding and flees from the battle',
        fullCounterTriggered: 'Full counter applies and reflects 100% damage taken',
        stance: 'Reflects 50% damage taken and deals ${Math.floor(damage / 2)} dmg',
        dodgeSuccess: 'Successfully dodged the attack and took no damage',
        stabTriggered: 'Successfully dodged the attack and used stab dealing ${damage} dmg ',
        dodgeFailure: 'Failed to dodge the attack and received ${damage} dmg',
        winnerReward: '${player2.username} has won the battle!\nRewards: ${rewards}',
    }
}