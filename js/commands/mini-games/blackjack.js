import Discord from "discord.js";
import currencyFormat from "../../helper/currency.js";
import queryData from "../../helper/query.js";
import { activeCommand, deactiveCommand } from "../../helper/setActiveCommand.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

function blackjack(msg, args, stat) {
    if (isNaN(parseInt(args[0])) || parseInt(args[0]) <= 0) {
        return msg.channel.send(`${emojiCharacter.noEntry} | Please provide a valid amount of gold \n${emojiCharacter.blank} Correct usage \`tera blackjack [bet]\``)
    }
    var bet = args[0];
    if (bet > 500000) {
        return msg.channel.send(`${emojiCharacter.noEntry} | Cannot bet more than __${currencyFormat(500000)}__!`)
    }
    if (bet > stat.gold) {
        return msg.channel.send(`${emojiCharacter.noEntry} | Nice try **${msg.author.username}**, your maximum bet is __${currencyFormat(stat.gold)}__!`)
    }
    
    activeCommand([msg.author.id]);

    var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
    var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var backcardEmoji = '<:backcard:845313768606007327>';
    var deck = [
        { Value: '2', Suit: 'Spades', Weight: 2, Emoji: '<:2k:845140811615305739>' },
        { Value: '2', Suit: 'Hearts', Weight: 2, Emoji: '<:2l:845140808251998220>' },
        { Value: '2', Suit: 'Diamonds', Weight: 2, Emoji: '<:2d:845140810231316520>' },
        { Value: '2', Suit: 'Clubs', Weight: 2, Emoji: '<:2s:845140811745460274>' },
        { Value: '3', Suit: 'Spades', Weight: 3, Emoji: '<:3k:845140811800117270>' },
        { Value: '3', Suit: 'Hearts', Weight: 3, Emoji: '<:3l:845140809208430633>' },
        { Value: '3', Suit: 'Diamonds', Weight: 3, Emoji: '<:3d:845140810407084042>' },
        { Value: '3', Suit: 'Clubs', Weight: 3, Emoji: '<:3s:845140811930796072>' },
        { Value: '4', Suit: 'Spades', Weight: 4, Emoji: '<:4k:845140810819436574>' },
        { Value: '4', Suit: 'Hearts', Weight: 4, Emoji: '<:4l:845140805831622666>' },
        { Value: '4', Suit: 'Diamonds', Weight: 4, Emoji: '<:4d:845140806327336970>' },
        { Value: '4', Suit: 'Clubs', Weight: 4, Emoji: '<:4s:845140811389468672>' },
        { Value: '5', Suit: 'Spades', Weight: 5, Emoji: '<:5k:845140811959238698>' },
        { Value: '5', Suit: 'Hearts', Weight: 5, Emoji: '<:5l:845140809593913357>' },
        { Value: '5', Suit: 'Diamonds', Weight: 5, Emoji: '<:5d:845140810063937556>' },
        { Value: '5', Suit: 'Clubs', Weight: 5, Emoji: '<:5s:845140812899680296>' },
        { Value: '6', Suit: 'Spades', Weight: 6, Emoji: '<:6k:845140812982910986>' },
        { Value: '6', Suit: 'Hearts', Weight: 6, Emoji: '<:6l:845140810659266560>' },
        { Value: '6', Suit: 'Diamonds', Weight: 6, Emoji: '<:6d:845140810222534696>' },
        { Value: '6', Suit: 'Clubs', Weight: 6, Emoji: '<:6s:845140813062078494>' },
        { Value: '7', Suit: 'Spades', Weight: 7, Emoji: '<:7k:845140812202377236>' },
        { Value: '7', Suit: 'Hearts', Weight: 7, Emoji: '<:7l:845140806838648842>' },
        { Value: '7', Suit: 'Diamonds', Weight: 7, Emoji: '<:7d:845140806729990184>' },
        { Value: '7', Suit: 'Clubs', Weight: 7, Emoji: '<:7s:845140811293392896>' },
        { Value: '8', Suit: 'Spades', Weight: 8, Emoji: '<:8k:845140812290981888>' },
        { Value: '8', Suit: 'Hearts', Weight: 8, Emoji: '<:8l:845140810693476352>' },
        { Value: '8', Suit: 'Diamonds', Weight: 8, Emoji: '<:8d:845140810940940298>' },
        { Value: '8', Suit: 'Clubs', Weight: 8, Emoji: '<:8s:845182444184666142>' },
        { Value: '9', Suit: 'Spades', Weight: 9, Emoji: '<:9k:845140812119670804>' },
        { Value: '9', Suit: 'Hearts', Weight: 9, Emoji: '<:9l:845140810168926218>' },
        { Value: '9', Suit: 'Diamonds', Weight: 9, Emoji: '<:9d:845140809979658281>' },
        { Value: '9', Suit: 'Clubs', Weight: 9, Emoji: '<:9s:845140812945948692>' },
        { Value: '10', Suit: 'Spades', Weight: 10, Emoji: '<:10k:845140811750572042>' },
        { Value: '10', Suit: 'Hearts', Weight: 10, Emoji: '<:10l:845140808498675772>' },
        { Value: '10', Suit: 'Diamonds', Weight: 10, Emoji: '<:10d:845140809669410826>' },
        { Value: '10', Suit: 'Clubs', Weight: 10, Emoji: '<:10s:845140812739117096>' },
        { Value: 'J', Suit: 'Spades', Weight: 10, Emoji: '<:jk:845140810407084092>' },
        { Value: 'J', Suit: 'Hearts', Weight: 10, Emoji: '<:jl:845140806616219699>' },
        { Value: 'J', Suit: 'Diamonds', Weight: 10, Emoji: '<:jd:845140806226280458>' },
        { Value: 'J', Suit: 'Clubs', Weight: 10, Emoji: '<:js:845140809673998367>' },
        { Value: 'Q', Suit: 'Spades', Weight: 10, Emoji: '<:kk:845140812013764608>' },
        { Value: 'Q', Suit: 'Hearts', Weight: 10, Emoji: '<:kl:845140799607537694>' },
        { Value: 'Q', Suit: 'Diamonds', Weight: 10, Emoji: '<:kd:845140806612287538>' },
        { Value: 'Q', Suit: 'Clubs', Weight: 10, Emoji: '<:ks:845140810823106570>' },
        { Value: 'K', Suit: 'Spades', Weight: 10, Emoji: '<:qk:845140812589301780>' },
        { Value: 'K', Suit: 'Hearts', Weight: 10, Emoji: '<:ql:845140800341147658>' },
        { Value: 'K', Suit: 'Diamonds', Weight: 10, Emoji: '<:qd:845140811226021948>' },
        { Value: 'K', Suit: 'Clubs', Weight: 10, Emoji: '<:qs:845140812579864576>' },
        { Value: 'A', Suit: 'Spades', Weight: 11, Emoji: '<:ak:845140810906599466>' },
        { Value: 'A', Suit: 'Hearts', Weight: 11, Emoji: '<:al:845140799348146196>' },
        { Value: 'A', Suit: 'Diamonds', Weight: 11, Emoji: '<:ad:845140806825672735>' },
        { Value: 'A', Suit: 'Clubs', Weight: 11, Emoji: '<:as:845183255485612033>' }
    ]
    var players = [
        { Name: msg.author.username, ID: 1, Points: 0, Hand: [] },
        { Name: 'Dealer', ID: 2, Points: 0, Hand: [] }
    ];
    var message;
    var currentPlayer = 0;
    var player1Card = '';
    var player2Card = '';
    var player2Point = 0;
    var hand1 = 0;
    var hand2 = 0;
    var embed;
    var turn = 0;
    var result = 99;
    var embedColor = 10115509;

    startblackjack(msg);
    
    function shuffle(deck) {
        // for 1000 turns
        // switch the values of two random cards
        for (var i = 0; i < 1000; i++) {
            var location1 = Math.floor((Math.random() * deck.length));
            var location2 = Math.floor((Math.random() * deck.length));
            var tmp = deck[location1];

            deck[location1] = deck[location2];
            deck[location2] = tmp;
        }
    }

    function createPlayers(message, players) {
        players = [
            { Name: message.author.username, ID: 1, Points: 0, Hand: [] },
            { Name: 'Dealer', ID: 2, Points: 0, Hand: [] }
        ];
    }

    function startblackjack(msg) {
        players = [
            { Name: msg.author.username, ID: 1, Points: 0, Hand: [] },
            { Name: 'Dealer', ID: 2, Points: 0, Hand: [] }
        ];
        player1Card = '';
        player2Card = '';
        hand1 = 0;
        hand2 = 0;
        result = 99;
        turn = 1;
        currentPlayer = 0;
        embedColor = 10115509;


        message = msg;
        // deal 2 cards to every player object
        shuffle(deck);
        createPlayers(msg, players);
        dealHands();
        //console.log(player1Card)
        var renderMessage = async function () {
            player2Point = result == 99 ? players[1]['Hand'][0]['Weight'] + ' + ' + '?' : players[1].Points;
            embed = new Discord.MessageEmbed({
                type: "rich",
                description: result == 99 ? `\`hit\` or \`stay\`` : null,
                url: null,
                color: result == 0 ? 3066993 : result == 1 ? 15158332 : result == 2 ? 9807270 : embedColor,
                fields: [
                    {
                        name: message.author.username + ` \`[${players[0].Points}]\``,
                        value: player1Card,
                        inline: true,
                    },
                    {
                        name: `Dealer \`[${player2Point}]\``,
                        value: player2Card,
                        inline: true,
                    },
                ],
                footer: {
                    text: `Bet: ${currencyFormat(bet)}`
                },
                author: {
                    "name": `${message.author.username}'s blackjack`,
                    "url": null,
                    "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                    "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                },
                thumbnail: {
                    url: `https://cdn.discordapp.com/attachments/845278131551469608/845278265970262016/black_jack_logo.png`,
                    proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https://cdn.discordapp.com/attachments/845278131551469608/845278265970262016/black_jack_logo.png`,
                    height: 70,
                    width: 40
                },
                files: []
            });

            if (result == 0) {
                embedColor = 3066993
                embed.addField('Result', '🎉 ' + `${players[1].Points > 21 ? 'Dealer bust, you \`win\`' : 'You \`win\`'}!`)
                deactiveCommand([message.author.id]);
            } else if (result == 1) {
                embedColor = 15158332
                embed.addField('Result', '👎 ' + `${players[0].Points > 21 ? 'Bust, you \`lost\`' : 'You \`lost\`'}!`)
                deactiveCommand([message.author.id]);
            } else if (result == 2) {
                embedColor = 9807270
                embed.addField('Result', `It's a tie`)
                deactiveCommand([message.author.id]);
            }
        
            await message.channel.send(embed)
                .then(function (message2) {
                    // message2.react('▶️')
                    // message2.react('🛑')
                    if (result == 99) {
                        const filter = m => (m.author.id === message.author.id && (m.content.toLowerCase() == 'hit' || m.content.toLowerCase() == 'stay' || m.content.toLowerCase() == 'stand'))
                        message2.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ['time']
                        }).then(message => {
                            message = message.first();
                            if (message.content.toLowerCase() === 'hit') {
                                hand1 += 1;
                                turn++;
                                hitMe(0, hand1);
                                //console.log(players[0].Points)
                                setTimeout(() => {
                                    renderMessage();
                                }, 200)
                                //console.log('hit')
                            } else {
                                //console.log('stay')
                                turn++;
                                stay(1, hand2);
                                setTimeout(() => {
                                    renderMessage();
                                }, 200)
                            }
                        })
                            .catch((err) => {
                                deactiveCommand([message.author.id]);
                                message.channel.send(new Discord.MessageEmbed({
                                    type: "rich",
                                    url: null,
                                    color: embedColor,
                                    fields: [
                                        {
                                            name: `Too slow, mwahahaha...`,
                                            value: `You lost **${currencyFormat(bet)}**`,
                                            inline: true,
                                        }
                                    ],
                                    author: {
                                        "name": `${message.author.username}'s blackjack`,
                                        "url": null,
                                        "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                                        "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                                    },
                                    thumbnail: {
                                        url: `https://cdn.discordapp.com/attachments/845278131551469608/845278265970262016/black_jack_logo.png`,
                                        proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https://cdn.discordapp.com/attachments/845278131551469608/845278265970262016/black_jack_logo.png`,
                                        height: 70,
                                        width: 40
                                    },
                                    files: []
                                }))
                            });
                    }
                })
        }

        setTimeout(() => {
            renderMessage();
        }, 200)
    }

    function dealHands() {
        // alternate handing cards to each player
        // 2 cards each
        for (var i = 0; i < 2; i++) {
            hand1 = i;
            hand2 = i;
            for (var x = 0; x < players.length; x++) {
                var card = deck.pop();
                players[x].Hand.push(card);
                renderCard(x, i);
                updatePoints(players);
            }
        }

        // updateDeck();
    }


    function renderCard(currentPlayer, hand) {
        if (currentPlayer == 0) {
            player1Card += `${players[0]['Hand'][hand]['Emoji']}`;
        } else {
            if (turn == 1 && hand == 1) {
                player2Card += `${backcardEmoji}`;
            } else {
                // player2Card = '';
                // for (let i = 0; i <= hand; i++) {
                    player2Card += `${players[1]['Hand'][hand]['Emoji']}`;
                // }
            }
        }
    }

    function updatePoints() {
        for (var i = 0; i < players.length; i++) {
            getPoints(i, players);
        }
    }
        
    // returns the number of points that a player has in hand
    function getPoints(player) {
        var points = 0;
        let ace = 0;
        for (var i = 0; i < players[player].Hand.length; i++) {
            if (players[player].Hand[i].Weight == 11) {
                ace++;
            }
            points += players[player].Hand[i].Weight;
        }

        if (points > 21 && ace > 0) {
            points = points - (10 * ace);
        }
        players[player].Points = points;
        return points;
    }

    function check(player) {
        if (players[player].Points > 21) {
            //console.log('status = Player: ' + players[player].ID + ' BUST');
            end(players, result);
        } else if (player == 1 &&  players[1].Points >= 17) {
            end(players, result);
        }
    }


    function hitMe(player, hand) {
        // pop a card from the deck to the current player
        // check if current player new points are over 21
        var card = deck.pop();
        players[player].Hand.push(card);
        renderCard(player, hand);
        updatePoints(players);
        check(player);
    }

    function stay(hand) {
        currentPlayer = 1;
        // Dealer turn
        if (players[1].Points <= players[0].Points && players[1].Points < 17) {
            do {
                //console.log('hit')
                hand += 1;
                hitMe(1, hand);
            } while (players[1].Points <= players[0].Points && players[1].Points < 17);
            // end();
        } else {
            //console.log('hit end')
            end();
        }
    }

    function end() {
        //tie
        if (players[0].Points == players[1].Points) {
            result = 2
        // win
        } else if ((players[0].Points > players[1].Points && players[0].Points < 22) || players[1].Points > 21) {
            result = 0;
            queryData(`UPDATE stat SET gold=gold+${parseInt(bet)} WHERE player_id=${msg.author.id} LIMIT 1`);
            queryData(`INSERT stat2 SET gambling_win=${parseInt(bet)}, player_id=${msg.author.id} ON DUPLICATE KEY UPDATE gambling_win=gambling_win+${parseInt(bet)}`);
        // lose
        } else if ((players[0].Points < players[1].Points && players[1].Points) < 22 || players[0].Points > 21) {
            result = 1;
            queryData(`UPDATE stat SET gold=gold-${parseInt(bet)} WHERE player_id=${msg.author.id} LIMIT 1`);
        }
        if(turn)
        player2Card = '';
        for (let i = 0; i < players[1]['Hand'].length; i++) {
            player2Card += `${players[1]['Hand'][i]['Emoji']}`;
        }
        //console.log(result);
    }
}

export default blackjack;