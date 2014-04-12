/**
* Economy System (aka Money, Currency, Points, etc.)
* Remade by CreaturePhil
* writeMoney @param values (String, Integer/Double, Boolean)
*/

var economy = exports.economy = {
		writeMoney: function(uid, amount) {
			var data = fs.readFileSync('config/money.csv','utf8')
			var match = false;
			var money = 0;
			var row = (''+data).split("\n");
			var line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var parts = row[i].split(",");
				var userid = toUserid(parts[0]);
				if (uid.userid == userid) {
					var x = Number(parts[1]);
					var money = x;
					match = true;
					if (match === true) {
						line = line + row[i];
						break;
					}
				}
			}
			uid.money = money;
			uid.money = uid.money + amount;
			if (match === true) {
				var re = new RegExp(line,"g");
				fs.readFile('config/money.csv', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var result = data.replace(re, uid.userid+','+uid.money);
				fs.writeFile('config/money.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
				});
				});
			} else {
				var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
				log.write("\n"+uid.userid+','+uid.money);
			}
		},
	}

var cmds = {
	givepd: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('/givepd - Access denied.');
		if(!target) return this.sendReply('|raw|Correct Syntax: /givepd <i>user</i>, <i>amount</i>');
		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		if (parts[1] < 0) {
			return this.sendReply('Number cannot be negative.');
		}
		var p = 'PokeDollars';
		var cleanedUp = parts[1].trim();
		var giveMoney = Number(cleanedUp);
		if (giveMoney === 1) {
			p = 'PokeDollar';
		}
		economy.writeMoney(targetUser, giveMoney);
		this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + p + '. This user now has ' + targetUser.money + ' pokedollars.');
		targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + p + '.');
		fs.appendFile('logs/transactions.log','\n'+Date()+': '+targetUser.name+' was given '+giveMoney+' '+p+' from ' + user.name + '. ' + 'They now have '+targetUser.money + ' ' + p + '.');
	},

	takepd: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('/takepd - Access denied.');
		if(!target) return this.sendReply('|raw|Correct Syntax: /takepd <i>user</i>, <i>amount</i>');
		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		if (parts[1] < 0) {
			return this.sendReply('Number cannot be negative.');
		}
		var p = 'PokeDollars';
		var cleanedUp = parts[1].trim();
		var takeMoney = Number(cleanedUp);
		if (takeMoney === 1) {
			p = 'PokeDollar';
		}
		economy.writeMoney(targetUser, -takeMoney);
		this.sendReply(targetUser.name + ' has had ' + takeMoney + ' ' + p + ' removed. This user now has ' + targetUser.money + ' ' + p + '.');
		targetUser.send(user.name + ' has removed ' + takeMoney + ' ' +  p + ' from you.');
		fs.appendFile('logs/transactions.log','\n'+Date()+': '+targetUser.name+' losted '+takeMoney+' '+p+' from ' + user.name + '. ' + 'They now have '+targetUser.money + ' ' + p + '.');
	},

	transferpd: function(target, room, user) {
		if(!target) return this.sendReply('|raw|Correct Syntax: /transferpd <i>user</i>, <i>amount</i>');
		if (target.indexOf(',') >= 0) {
			var parts = target.split(',');
			if (parts[0].toLowerCase() === user.name.toLowerCase()) {
				return this.sendReply('You can\'t transfer PokeDollars to yourself.');
			}
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		}
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
		if (parts[1] < 0) {
			return this.sendReply('Number cannot be negative.');
		}
		if (String(parts[1]).indexOf('.') >= 0) {
			return this.sendReply('You cannot transfer numbers with decimals.');
		}
		if (parts[1] > user.money) {
			return this.sendReply('You cannot transfer more money than what you have.');
		}
		var p = 'PokeDollars';
		var cleanedUp = parts[1].trim();
		var transferMoney = Number(cleanedUp);
		if (transferMoney === 1) {
			p = 'PokeDollar';
		}
		economy.writeMoney(user, -transferMoney);
		//set time delay because of node asynchronous so it will update both users' money instead of either updating one or the other
		setTimeout(function(){economy.writeMoney(targetUser, transferMoney);fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has transferred '+transferMoney+' '+p+' to ' + targetUser.name + '. ' +  user.name +' now has '+user.money + ' ' + p + ' and ' + targetUser.name + ' now has ' + targetUser.money +' ' + p +'.');},3000);
		this.sendReply('You have successfully transferred ' + transferMoney + ' to ' + targetUser.name + '. You now have ' + user.money + ' ' + p + '.');
		targetUser.send(user.name + ' has transferred ' + transferMoney + ' ' +  p + ' to you.');
	},

	shop: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><h4><b><u>The Haven Shop</u></b></h4><table border="1" cellspacing="0" cellpadding="3"><tr><th>Command</th><th>Description</th><th>Cost</th></tr><tr><td>Symbol</td><td>Buys a custom symbol to go infront of name and puts you at top of userlist. (temporary until restart)</td><td>5</td></tr><tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or trainer card. (don\'t buy if you have neither)</td><td>10</td></tr><tr><td>Poof</td><td>Buys the ability to add a custom poof.</td><td>15</td></tr><tr><td>Custom</td><td>Buys a custom avatar to be applied to your name. (you supply)</td><td>20</td></tr><tr><td>Animated</td><td>Buys an animated avatar to be applied to your name. (you supply)</td><td>25</td></tr><tr><td>Trainer</td><td>Buys a trainer card which shows information through a command such as <i>/creaturephil</i>.</td><td>30</td></tr><tr><td>Room</td><td>Buys a chatroom for you to own. (within reason, can be refused)</td><td>50</td></tr><tr><td>Voice</td><td>Buys a promotion to global voice.</td><td>100</td></tr><tr><td>Player</td><td>Buys a promotion to global player.</td><td>250</td></tr></table></table><br/>To buy an item from the shop, use /buy <i>command</i>. <br/></center>');
	},

	buy: function(target, room, user) {
		if (!target) return this.sendReply('|raw|Correct Syntax: /buy <i>command</i>');
		var data = fs.readFileSync('config/money.csv','utf8')
		var match = false;
		var money = 0;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
			var x = Number(parts[1]);
			var money = x;
			match = true;
			if (match === true) {
				line = line + row[i];
				break;
			}
			}
		}
		user.money = money;
		var price = 0;
		if (target === 'symbol') {
			price = 5;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour.');
				this.sendReply('|raw|Use /customsymbol <i>symbol</i> to change your symbol now.');
				user.canCustomSymbol = true;
				this.add(user.name + ' has purchased a custom symbol.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'fix') {
			price = 10;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a fix for a custom avatar or trainer card. Private Message an admin to alter it for you.');
				user.canFix = true;
				this.add(user.name + ' has purchased a fix for his custom avatar or trainer card.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'poof') {
			price = 15;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a the ability to add a custom poof. Private Message an admin to add it in.');
				user.canAddPoof = true;
				this.add(user.name + ' has purchased the ability to add a custom poof.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'custom') {
			price = 20;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased an Custom Avatar. Private Message an admin add it in.');
				user.canCustomAvatar = true;
				this.add(user.name + ' has purchased a custom avatar.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'animated') {
			price = 25;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased an Animated Avatar. Private Message an admin add it in.');
				user.canAnimatedAvatar = true;
				this.add(user.name + ' has purchased a animated avatar.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'trainer') {
			price = 30;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a trainer card. You need to message an admin capable of adding this.');
				user.canTrainerCard = true;
				this.add(user.name + ' has purchased a trainer card.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'room') {
			price = 50;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a room. Private Message an admin to make the room.');
				user.canRoom = true;
				this.add(user.name + ' has purchased a room.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'voice') {
			price = 100;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a promotion to global voice. Private Message an admin to promote you.');
				user.canVoice = true;
				this.add(user.name + ' has purchased a promotion to voice.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (target === 'player') {
			price = 250;
			if (price <= user.money) {
				user.money = user.money - price;
				this.sendReply('You have purchased a promotion to global player. Private Message an admin to promote you.');
				user.canPlayer = true;
				this.add(user.name + ' has purchased a promotion to player.');
				fs.appendFile('logs/transactions.log','\n'+Date()+': '+user.name+' has bought a ' + target + ' for ' + price + ' PokeDollars. ' + user.name + ' now has ' + user.money + ' PokeDollars' + '.');
			} else {
				return this.sendReply('You do not have enough PokeDollars for this. You need ' + (price - user.money) + ' more PokeDollars to buy ' + target + '.');
			}
		}
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/money.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, user.userid+','+user.money);
			fs.writeFile('config/money.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
			log.write("\n"+user.userid+','+user.money);
		}
	},

	customsymbol: function(target, room, user) {
		if(!user.canCustomSymbol) return this.sendReply('You need to buy this item from the shop to use.');
		if(!target || target.length > 1) return this.sendReply('|raw|/customsymbol <i>symbol</i> - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
		var a = target;
		if (a === "+" || a === "$" || a === "%" || a === "@" || a === "&" || a === "~" || a === "#" || a === "a" || a === "b" || a === "c" || a === "d" || a === "e" || a === "f" || a === "g" || a === "h" || a === "i" || a === "j" || a === "k" || a === "l" || a === "m" || a === "n" || a === "o" || a === "p" || a === "q" || a === "r" || a === "s" || a === "t" || a === "u" || a === "v" || a === "w" || a === "x" || a === "y" || a === "z" || a === "!" || a === "?" || a === "\u2605") {
			return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
		}
		user.getIdentity = function(){
			if(this.muted)	return '!' + this.name;
			if(this.locked) return '‽' + this.name;
			return target + this.name;
		};
		user.updateIdentity();
		user.canCustomSymbol = false;
		user.hasCustomSymbol = true;
	},

	resetsymbol: function(target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol!');
		user.getIdentity = function() {
			if (this.muted) return '!' + this.name;
			if (this.locked) return '‽' + this.name;
			return this.group + this.name;
		};
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
