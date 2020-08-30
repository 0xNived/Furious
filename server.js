const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "NzQ4NDQ3MzM4ODM3ODM1Nzc3.X0dj5w.SIZHDREOSnXM2MJX1ilOfmNPHi4";
const db = require("quick.db");
const prefix = "u.";
let authors = [
  "502724388110598144",
  "489627045148491796",
  "589131939982737466"
];

const http = require("http");
const express = require("express");
const app = express();
const activities_list = ["u.help || u.invite", "u.help || u.invite"];

const emojiname = [
  "691142540463702026",
  "🇺🇲",
  "🇮🇳",
  "🇫🇷",
  "🇪🇺",
  "691146674239832116",
  "691146692770398240"
];

let serverID = "744843192175820890";
bot.on("ready", () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    bot.user.setActivity(activities_list[index]);
  }, 2000);
  console.log("Hello World! Logged in as " + bot.user.tag);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bot.on("message", async message => {
  if (message.author.bot) return;

  let args = message.content.slice(prefix.length).split(" ");
  let command = args.shift().toLowerCase();

  /*if (message.guild) {
    if (command == "setupalliance") {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send(
          "You need Admin Permissions to setup system!"
        );
      }
 let channel = message.guild.channels.find(r => r.name == "❐丨ᴄᴏᴍᴍᴜɴɪᴛʏ ꜱᴇʀᴠᴇʀꜱ!");
    if (channel)
return message.channel
        .send("There is already a `ᴄᴏᴍᴍᴜɴɪᴛʏ ꜱᴇʀᴠᴇʀꜱ!` channel")
        .then(r => r.delete(4500));


      let role = message.guild.roles.find(x => x.name == "ALC");
      let everyone = message.guild.roles.find(x => x.name == "@everyone");

      if (!role) {
        role = await message.guild.roles.create({
          data: {
            name: "ALC",
            color: "GREEN"
          },
          reason: "Role needed for  System"
        });
      }


   await message.guild.createChannel("❐丨ᴄᴏᴍᴍᴜɴɪᴛʏ ꜱᴇʀᴠᴇʀꜱ!", {
        type: "text",
        topic: "ALLIANCE HEADER ",
        permissionOverwrites: [
          {
            id: role.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
          },
          {
            id: everyone.id,
            deny: [ "SEND_MESSAGES"]
          }
        ]
      });

      return message.channel.send("Setup is Completed ");
  } */
bot.on("message", message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

   if(!command.startsWith(prefix)) return;

})
  if (message.content.startsWith(prefix + "setup")) {

    if ( !message.member.hasPermission("ADMINISTRATOR"))
      return message.author.send(
        "**Error!! You don't have admin permission**"
      )
    let channel = message.mentions.channels.first();
    if (!channel)
      return message.channel.send(
        "You have to mention a channel first in order to set that as alliance"
      );
    let id = channel.id;
    if (id == null || id == undefined || !id)
      return message.channel.send("You mentioned an invalid channel");
    if (!channel.permissionsFor(bot.user).has("SEND_MESSAGES")) {
      return message.channel.send(
        "I don't have perms to send message in that channel"
      );
    }
    await db.set(`alliance_${message.guild.id}`, id);

    return message.channel.send("Updated alliance channel");
  }

  if (message.content.startsWith(prefix + "sendalc")) {
    if (
      message.author.id == authors[0] ||
      message.author.id == authors[1] ||
      message.author.id == authors[2]
    ) {
      let text = message.content
        .split(" ")
        .slice(1)
        .join(" ");

      if (!text) return message.channel.send("I cannot send blank message");
      let logs = db.fetch(`logs_${message.guild.id}`);
      let logCh = message.guild.channels.get(logs);

      if (!logCh || logCh == null || logCh == undefined)
        return message.channel.send(
          "First please setup logs channel use `" + prefix + "logs #channel`"
        );

      message.channel.send("sending msg to all partner's servers...");

      bot.guilds.forEach(async g => {
        let chID = db.fetch(`alliance_${g.id}`);

        let channel = g.channels.get(chID);

        if (channel == null || channel == undefined || !channel) {
          return;
        } else if (!channel.permissionsFor(bot.user).has("SEND_MESSAGES")) {
          try {
            await g.owner.send(
              "I cannot send message in <#" +
                chID +
                ">, So your server has removed from partnered servers"
            );
            await db.delete(`alliance_${g.id}`);
            return;
          } catch (e) {
            await db.delete(`alliance_${g.id}`);
            return;
          }
        } else {
          await channel.send(text);
          await logCh.send("SEND ALLIANCE MESSAGE TO `" + g.name + "`");
          return;
        }
      });
      return message.channel.send("Done! sent.");
    } else {
      return;
    }
  }

  if (message.content.startsWith(prefix + "logs")) {
    if (message.author.id == authors[0] || message.author.id == authors[1]) {
      let channel = message.mentions.channels.first();
      if (!channel)
        return message.channel.send(
          "Please mention a channel first in order to set as logs channel"
        );

      await db.set(`logs_${message.guild.id}`, channel.id);

      return message.channel.send("updated logs channel");
    } else {
      return;
    }
  }

  if (message.content.startsWith(prefix + "partners")) {
  if (
      message.author.id == authors[0] ||
      message.author.id == authors[1] ||
      message.author.id == authors[2]
    ) {
    let non_partners = 0;
    let partners = 0;

    bot.guilds.forEach(async g => {
      let channelID = db.fetch(`alliance_${g.id}`);

      let channel = g.channels.get(channelID);

      if (channel == null || channel == undefined || !channel) {
        non_partners++;
        return;
      } else {
        partners++;
        return;
      }
    });

    return message.channel.send({
      embed: {
        description:
          "Partners : `" + partners + "`\n\nOthers : `" + non_partners + "`"
      }
    });
  }
}});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", async message => {
  if (message.content.startsWith(prefix + "stats")) {
message.delete()
  if (
      message.author.id == authors[0] ||
      message.author.id == authors[1] ||
      message.author.id == authors[2]
    ) {
    let on = 0;
    let of = 0;
    let partners = 0;

    function stats() {
      bot.users.forEach(user => {
        if (
          `${user.presence.status}` == "online" ||
          `${user.presence.status}` == "dnd" ||
          `${user.presence.status}` == "idle"
        ) {
          on++;
        }
        if (`${user.presence.status}` == "offline") {
          of++;
        }
      });
      let pservers = bot.guilds.forEach(g => {
        let chID = db.fetch(`alliance_${g.id}`);

        let ch = g.channels.get(chID);
        if (!ch || ch == null || ch == undefined) {
          return;
        } else {
          partners++;
        }
      });
    }

    await stats();
    let embed = new Discord.RichEmbed()
      .setColor(0xff0000)
      .setDescription(
        "**:desktop: Status Panel**\n\n:green_circle:  Online Users : " +
          on +
          "\n\n:red_circle:  Offline Users : " +
          of +
          "\n\n:yellow_circle: Servers Counting : " +
          bot.guilds.size +
          //    "\n\nPartnerted Servers : " +
          //  partners +
          "\n\n:blue_circle: Total Users Counting : " +
          bot.guilds.reduce((a, g) => a + g.memberCount, 0) +
          " "
      )
      .setThumbnail(bot.user.displayAvatarURL);
    await message.channel.send(embed).then(msg => {
      setInterval(function() {
        on = 0;
        of = 0;

        stats();
        let embed1 = new Discord.RichEmbed()
          .setColor(0xff0000)
          .setDescription(
            "**:desktop: Status Panel**\n\n:green_circle:  Online Users : " +
              on +
              "\n\n:red_circle:  Offline Users : " +
              of +
              "\n\n:yellow_circle: Servers Counting : " +
              bot.guilds.size +
              //    "\n\nPartnerted Servers : " +
              //  partners +
              "\n\n:blue_circle: Total Users Counting : " +
              bot.guilds.reduce((a, g) => a + g.memberCount, 0) +
              " "
          )
          .setThumbnail(bot.user.displayAvatarURL);

        msg.edit(embed1);
      }, 60000);
    });
  }
}});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", msg => {
  if (msg.author.bot) return;

  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const command = args.shift().toLowerCase();
  if (msg.channel.id != "748484010463854693") return msg.channel;

  if (msg.content.startsWith("u.ids")) {
    msg.delete();
    if (msg.author.id != "489627045148491796")
      if (msg.author.id != "589131939982737466")
        return msg.channel
          .send("**This command was removed from the bot**")
          .then(r => r.delete(5000));
    bot.guilds.forEach(ID => {
      msg.channel
        .send(
          `\n\n **----------------------------------------------------------------------

From Server:** ${ID.name} ,\n **Server ID:** ${ID.id} ,\n **Member Count:** ${ID.memberCount} 
`
        )
        .catch(error => {
          console.log("Error Caught");
        });
    });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bot.on("message", async msg => {
  if (msg.author.bot) return;

  let args = msg.content.slice(prefix.length).split(" ");
  let command = args.shift().toLowerCase();

  if (msg.guild) {
    if (command == "xp") {
      if (
        !msg.member.hasPermission("ADMINISTRATOR") &&
        !msg.member.hasPermission("KICK_MEMBERS") &&
        !msg.member.hasPermission("BAN_MEMBERS")
      )
        return msg
          .reply("Sorry, you don't have permissions to use this!")
          .then(r => r.delete(4500));
      let channel = msg.mentions.channels.first();
      if (!channel) return msg.channel.send("You forget to mention a channel");
      db.set(`xp_${msg.guild.id}`, channel.id);

      return msg.channel.send("**Updated welcome channel**");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (command === "nico") {
      msg.channel.send(
        `***For Tecnical Support kindly Submit Your Question in Support Server*** https://discord.gg/kzy4VQU `
      );
    }
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", function(message) {
  if (message.author.equals(bot.users)) return;

  if (!message.content.startsWith(prefix)) return;

  var args = message.content.substring(prefix.length).split(" ");

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  switch (args[0].toLowerCase()) {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "invite":
      let embed = new Discord.RichEmbed()
        .addField(
          ":man_technologist:  **Tech Server 24/7!**",
          "[Click Here to Join Support Server!](https://discord.gg/bU2YdWX)"
        )

        .setColor(0xff0000)
        //  .setFooter("Requested by " + message.author.tag)
        .setTitle("*BOT INVITE LINK*")

        .addField(
          ":man_technologist:  **Invite Me**",
          " [Click Here To Invite Me!](https://discord.com/oauth2/authorize?client_id=748447338837835777&scope=bot&permissions=1074265153)"
        );

      message.author.send(embed);

      return message.reply("Please Cheak Your `DM` For Invite Link");
      break;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case "help":
      let embsed = new Discord.RichEmbed().setColor(0xff0000).addField(
        prefix + "setup",
        ` 

Example **u.setp #general** 
so it will send alliance message to general and also You will be became Our partner 
its automated :)
Enjoy Service !  `
      );
      message.channel.send(embsed);
      break;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    default:
  }

  /////////////////////////////////////////////////////////////////

  let guildArray = bot.guilds.array();
});

bot.on("guildCreate", guild => {
  let join = new Discord.RichEmbed()
    .setColor(0xff0000)
    .setTitle("Server Joined")
    .addField("Server Name :", guild.name)
    .addField("Server Owner :", guild.owner.user.tag)
    .setThumbnail(guild.iconURL)
    .addField("Server ID :", guild.id)
    .addField("Server Members :", guild.memberCount)
    .setFooter(`Now Bot Is In ${bot.guilds.size} Servers.`);
  bot.channels.find(r => r.id == "744850291555434646").send(join);
  console.log("Joined a new guild: " + guild.name);
});

bot.on("guildDelete", guild => {
  let leave = new Discord.RichEmbed()
    .setColor(0xff0000)
    .setTitle("Server Removed")
    .addField("Server Name :", guild.name)
    .addField("Server Owner :", guild.owner.user.tag)
    .setThumbnail(guild.iconURL)
    .addField("Server ID :", guild.id)
    .addField("Server Members :", guild.memberCount)
    .setFooter(`Now Bot Is In ${bot.guilds.size} Servers.`);
  bot.channels.find(r => r.id == "744850333016260659").send(leave);

  console.log("Left guild: " + guild.name);
});
//bot.on("message", msg => {
//if (msg.author.bot) return;

//const args = msg.content
//   .slice(prefix)
//    .trim()
//   .split(/ +/g);
//
// bot.on("guildCreate", guild => {
//    let ch = db.fetch(`xp_${msg.guild.id}`);
//    msg.guild.channels.get(ch).send({
//     embed: {
//      description: `BOT INVITED TO NEW SERVER IN **${guild.name}** BY ${msg.author} `,
//      color: 16761035,
//     image: {
//        url:
//       "https://cdn.glitch.com/bb7749f9-3498-4ae1-8e40-5777074474d3%2Fwow.jpg?v=1597667221770"
//     }
//    }
//  });///*
// console.log("Joined a new guild: " + guild.name);

//   bot.on("guildDelete", guild => {
//     let ch = db.fetch(`xp_${msg.guild.id}`);
//   msg.guild.channels.get(ch).send({
//////       embed: {
//       description: `BOT LEFT FROM  **${guild.name}** SERVER  KICKED BY ${msg.author} `,
//      color: 16761035,
//  image: {
//     url:
//    "https://cdn.glitch.com/bb7749f9-3498-4ae1-8e40-5777074474d3%2Fwow.jpg?v=1597667221770"
//        }//
//     }//
//     });//
// //  });//
//  });////
//});//
//
///////////////////////////////////////////////////////////////////////////

bot.login(token);
