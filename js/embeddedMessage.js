import Discord from 'discord.js';

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

function enchantSet(author,enchantRank) {
    const embedded = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Enchants Notify Set')
        .setAuthor(author)
        .setDescription(`You will be mute 5 second, when enchant result is ${enchantRank} Above it `);
    
    return embedded;
}

function profile(client, id, username, avatar, rank, title) {
	
	return new Discord.MessageEmbed({
		type: "rich",
		title: title,
		description: null,
		url: null,
		color: 10115509,
		timestamp: null,
		fields: [
			{
				value: " ** Level **: (44.55 %) \n ** XP **: 338,841 / 760,500\n ** Area **: 9(Max: 9) \n ** Time travels **: 1",
				name: "PROGRESS",
				inline: false
			},
			{
				value: " :crossed_swords: ** AT **: 256\n :shield:  ** DEF **: 268\n :heart: ** LIFE **: 415 / 485",
				name: "STATS",
				inline: true
			},
			{
				value: " <:basic_sword:800980367015542814> [+7] \n <:basic_armor:800981013668823050> [+8] \n :unicorn: [Epic]",
				name: "EQUIPMENT",
				inline: true
			},
			{
				value: " :coin: ** Coins **: 2,156,078\n :dollar: ** EPIC coins **: 166\n :bank: ** Bank **: 70,693,874",
				name: "MONEY",
				inline: false
			}],
		thumbnail: {
			url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
			proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`,
			height: 0,
			width: 0
		},
		image: null,
		video: null,
		author: {
			name: `${username}'s profile`,
			url: null,
			iconURL: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
			proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
		},
		provider: null,
		footer: {
			text: `RANK: ${rank}`,
			iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
			proxyIconURL: `https://images-ext-1.discordapp.net/external/DIxgPOIeSdmfHuboNFOPhyAJyjRQ9bUoQMePmqundGg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
		},
		files: []
	});	
}

function cooldownMessage(id, username, avatar, command, time) {
	return new Discord.MessageEmbed({
		type: "rich",
		description: null,
		url: null,
		color: 10115509,
		timestamp: null,
		fields: [
			{
				value: `You are on cooldown, please try again after **${time} !**`,
				name: `:hourglass_flowing_sand: | ${command}`,
				inline: false
			}],
		author: {
			name: `${username}'s cooldown`,
			url: null,
			iconURL: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
			proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
		},
		files: []
	});
}
export {
	exampleEmbed,
	profile,
	enchantSet,
	cooldownMessage,
}
