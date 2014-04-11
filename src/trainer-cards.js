var cmds = {
  aananth: function(target, room, user) {
	    	if (!this.canBroadcast()) return;
	    	this.sendReplyBox('<center><img src=http://play.pokemonshowdown.com/sprites/xyani/charizard-mega-x.gif width="150" length="150"><img src=http://i.imgur.com/afSRAAO.png width="250"><img src=http://play.pokemonshowdown.com/sprites/xyani/charizard-mega-y.gif img width="150" length="150"></center>');
  },
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
