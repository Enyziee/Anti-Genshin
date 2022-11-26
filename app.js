const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on("presenceUpdate", (oldPresence, newPresence) => {

    let guild = newPresence.guild;

    if (newPresence.activities.find(element => element == "Genshin Impact")) {
        console.log(`${newPresence.user.username} entrou do genshin`);

        guild.channels.fetch('1039657602252025916').then(channel => {
            channel.send(`Sai dessa porra de jogo <@${newPresence.userId}>`);
        });
    }

    if (oldPresence.activities.find(element => element == "Genshin Impact")) {
        console.log(`${newPresence.user.username} saiu do genshin`);

        // guild.channels.fetch('897881228466847838').then(channel => {
        //     channel.send(`<@${newPresence.userId}>`);
        // });
    }

    


});

client.login(token);

