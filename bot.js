const Discord  = require('discord.js');
const client     = new Discord.Client();
const prefix   = "-";
const category = "category-id";
const devs     = ["484326398568300555", "test"];
let mtickets   = true;
let tchannels  = [];
let current    = 0;
client.on('ready', function(){
    var ms = 0;
    var setGame = [`[ -new (تكت) ]`];   
    var i = -1;
    var j = 0;
    setInterval(function (){
        if( i == -1 ){
            j = 1;
        }
        if( i == (setGame.length)-1 ){
            j = -1;
        }
        i = i+j;
        client.user.setGame(setGame[i],`http://www.twitch.tv/KiNg66S`);
    }, ms);0
});


client.on('ready',async () => console.log(`   - " ${client.user.username} " , Tickety is ready to work.`));
client.on('message',async message => {
    if(message.author.bot || message.channel.type === 'dm') return;
    let args = message.content.split(" ");
    let author = message.author.id;
    if(args[0].toLowerCase() === `-help`) {
            let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setThumbnail(message.author.avatarURL)
            .setColor("#36393e")
			.addField(`⇏ -new                     → لفتح تكت`)
            .addField(`⇏ -close                   → لغلق تكت`)
            .addField(`⇏ -mtickets enable/disable → لتعطيل وتفعيل تكت `)
			.addField(`⇏ cleartickets             →  لمسح جميع تكتات`)
            .addField(``)
            await message.channel.send(`:white_check_mark: , **هذه قائمة بجميع اوامر البووت.**`);
            await message.channel.send(embed);
    } else if(args[0].toLowerCase() === `${prefix}new`) {
        if(mtickets === false) return message.channel.send(`:tools: , **تم ايقاف هذه الخاصية من قبل احد ادارة السيرفر**`);
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`:tools: , **البوت لا يملك صلاحيات لصنع الروم**`);
		console.log(current);
		let openReason = "";
		current++;
    	message.guild.createChannel(`ticket-${current}`, 'text').then(c => {
		tchannels.push(c.id);
		c.setParent(category);
		message.channel.send(`**:tickets: تم عمل التكت.**`);
		c.overwritePermissions(message.guild.id, {
			READ_MESSAGES: false,
			SEND_MESSAGES: false
		});
		c.overwritePermissions(message.author.id, {
			READ_MESSAGES: true,
			SEND_MESSAGES: true
		});
		
		if(args[1]) openReason = `\nسبب فتح التكت , " **${args.slice(1).join(" ")}** "`;
		let embed = new Discord.RichEmbed()
		.setAuthor(message.author.username, message.author.avatarURL)
		.setColor("#36393e")
		.setDescription(`**انتظر قليلا الى حين رد الادارة عليك**${openReason}`);
		c.send(`${message.author}`);
		c.send(embed);
	});
    } else if(args[0].toLowerCase() === `${prefix}mtickets`) {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`:tools: , **أنت لست من ادارة السيرفر لتنفيذ هذا الأمر.**`);
		if(args[1] && args[1].toLowerCase() === "enable") {
			mtickets = true;
			message.channel.send(`:white_check_mark: , **تم تفعيل التكتات , الاَن يمكن لأعضاء السيرفر استخدام امر انشاء التكت**`);
		} else if(args[1] && args[1].toLowerCase() === "disable") {
			mtickets = false;
			message.channel.send(`:white_check_mark: , **تم اغلاق نظام التكتات , الاَن لا يمكن لأي عضو استخدام هذا الأمر**`);
		} else if(!args[1]) {
			if(mtickets === true) {
			mtickets = false;
			message.channel.send(`:white_check_mark: , **تم اغلاق نظام التكتات , الاَن لا يمكن لأي عضو استخدام هذا الأمر**`);
			} else if(mtickets === false) {
			mtickets = true;
			message.channel.send(`:white_check_mark: , **تم تفعيل التكتات , الاَن يمكن لأعضاء السيرفر استخدام امر انشاء التكت**`);
			}
		}
    } else if(args[0].toLowerCase() === `${prefix}close`) {
		if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`:tools:, **أنت لست من ادارة السيرفر لتنفيذ هذا الأمر.**`);
		if(!message.channel.name.startsWith('ticket-') && !tchannels.includes(message.channel.id)) return message.channel.send(`:tools:, **هذا الروم ليس من رومات التكت.**`);
		
		message.channel.send(`:white_check_mark:, **سيتم اغلاق الروم في 3 ثواني من الاَن.**`);
		tchannels.splice( tchannels.indexOf(message.channel.id), 1 );
		setTimeout(() => message.channel.delete(), 3000);
	} else if(args[0].toLowerCase() === `${prefix}restart`) {
		if(!devs.includes(message.author.id)) return message.channel.send(`:tools:, **أنت لست من ادارة السيرفر لأستخدام هذا الأمر.**`);
		message.channel.send(`:white_check_mark:, **جارى اعادة تشغيل البوت.**`);
		client.destroy();
	} else if(args[0].toLowerCase() === `${prefix}deletetickets`) {
		let iq = 0;
		for(let q = 0; q < tchannels.length; q++) {
			let c = message.guild.channels.get(tchannels[q]);
			if(c) {
				c.delete();
				tchannels.splice( tchannels[q], 1 );
				iq++;
			}
			if(q === tchannels.length - 1 || q === tchannels.lengh + 1) {
				message.channel.send(`:white_check_mark:, **تم مسح \`${iq}\` من التكتات.**`);
			}
		}
	}
});
client.on("message", async message => {
    if(message.content.startsWith(prefix + "help")) {
        let help = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(message.author.avatarURL)
			============
			 -new                     → لفتح تكت`)
             -close                   → لغلق تكت`)
             -mtickets enable/disable → لتعطيل وتفعيل تكت `)
			  cleartickets             →  لمسح جميع تكتات`)
			
			|ANIS_hdd ©|`);
            message.channel.sendEmbed(help);
    }
});

client.login(process.env.BOT_TOKEN);