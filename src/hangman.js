exports.hangman = function(h) {
        if (typeof h != "undefined") var hangman = h; else var hangman = new Object();
        var hangmanstuff = {
                reset: function(rid) {
                        hangman[rid] = {
                                guesses: 8,
                                hangman: false,
                                word: new Array(),
                                hangmaner: new Array(),
                                guessletters: new Array(),
                                guessedletters: new Array(),
                                guessedwords: new Array(),
                                correctletters: new Array(),
                                underscores: new Array(),
                                clue: new Array(),
                        }
                },
                
                
                guess: function(target,room,user) {
                lettertarget = target.toLowerCase();
                for(var y = 0; y < 27; y++) {
                        if(lettertarget === hangman[room.id].guessedletters[y]) {
                                return this.sendReply('Someone has already guessed the letter \'' + lettertarget + '\'.');
                        }
                }
                var letterright = new Array();
                for(var a = 0; a < hangman[room.id].word[0].length; a++) {
                        if(lettertarget === hangman[room.id].guessletters[a]) {
                                var c = a + 1;
                                letterright.push(c);
                                hangman[room.id].correctletters.push(c);
                                hangman[room.id].underscores[a] = lettertarget;
                        }
                }
                if(letterright[0] === undefined) {
                        hangman[room.id].guesses = hangman[room.id].guesses - 1;
                                if(hangman[room.id].guesses === 0) {
                                        hangman.reset(room.id);
                                        return room.add('|html|<b>' + user.name + '</b> guessed the letter \'' + lettertarget + '\', but it was not in the word. You have failed to guess the word, so the man has been hanged.');
                                }
                        room.add('|html|<b>' + user.name + '</b> guessed the letter \'' + lettertarget + '\', but it was not in the word.');
                }
                else {
                        room.add('|html|<b>' + user.name + '</b> guessed the letter \'' + lettertarget + '\', which was letter(s) ' + letterright.toString() + ' of the word.');
                }
                hangman[room.id].guessedletters.push(lettertarget);
                if(hangman[room.id].correctletters.length === hangman[room.id].word[0].length) {
                        room.add('|html|Congratulations! <b>' + user.name + '</b> has guessed the word, which was: \'' + hangman[room.id].word[0] + '\'.');
                        hangman.reset(room.id)
                }
                },
                
                
                guessword: function(target,room,user) {
                        if (target.length > 10) return this.sendReply('This guess is too long; it cannot exceed 10 characters.');
                var targetword = target.toLowerCase();
                if(targetword === hangman[room.id].word[0]) {
                        room.add('|html|Congratulations! <b>' + user.name + '</b> has guessed the word, which was: \'' + hangman[room.id].word[0] + '\'.');
                        hangman.reset(room.id)
                }
                else {
                        if (hangman[room.id].guessedwords.indexOf(target) != -1) {
                                return this.sendReply('Someone has already guessed this word.')
                        }
                        hangman[room.id].guesses = hangman[room.id].guesses - 1;
                        hangman[room.id].guessedwords.push(target);
                        if(hangman[room.id].guesses === 0) {
                                hangman.reset(room.id)
                                return room.add('|html|<b>' + user.name + '</b> guessed the word \'' + targetword + '\', but it was not the word. You have failed to guess the word, so the man has been hanged.');
                        }
                        room.add('|html|<b>' + user.name + '</b> guessed the word \'' + targetword + '\', but it was not the word.');
                }
                },
        };
        for (var i in hangmanstuff) {
                hangman[i] = hangmanstuff[i];
        }
        for (var i in Rooms.rooms) {
                if (Rooms.rooms[i].type == "chat" && !hangman[i]) {
                        hangman[i] = new Object();
                        hangman.reset(i);
                }
        }
        return hangman;
};

var cmds = {        
        hangmanhelp: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<font size = 2>A brief introduction to </font><font size = 3>Hangman:</font><br />' +
                                                'The classic game, the basic idea of hangman is to guess the word that someone is thinking of before the man is "hanged." Players are given 8 guesses before this happens.<br />' + 
                                                'Games can be started by any of the rank Voice or higher, including Room Voice, Room Mod, and Room Owner.<br />' +
                                                'The commands are:<br />' +
                                                '<ul><li>/hangman [word], [description] - Starts the game of hangman, with a specified word and a general category. Requires: + % @ & ~</li>' +
                                                '<li>/guess [letter] - Guesses a letter.</li>' +
                                                '<li>/word [word] - Guesses a word.</li>' +
                                                '<li>/viewhangman - Shows the current status of hangman. Can be broadcasted.</li>' +
                                                '<li>/word - Allows the person running hangman to view the word.</li>' +
                                                '<li>/category [description] OR /topic [description] - Allows the person running hangman to changed the topic.</li>' +
                                                '<li>/endhangman - Ends the game of hangman in the room. Requires: + % @ & ~</li></ul>');
        },

        hangman: function(target, room, user) {
                if (!user.can('broadcast', null, room)) {
                        return this.sendReply('You do not have enough authority to do this.');
                }
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if(hangman[room.id].hangman === true) {
                        return this.sendReply('There is already a game of hangman going on.');
                }
                if(!target) {
                        return this.sendReply('The correct syntax for this command is /hangman [word], [topic]');
                }
                if(room.type === 'battle') {
                        return this.sendReply('You cannot start this in a battle room.');
                }
                if(hangman[room.id].hangman === false) {
                        var targets = target.split(',');
                        if(!targets[1]) {
                                return this.sendReply('Make sure you include a topic.');
                        }
                        if(targets[0].length > 10) {
                                return this.sendReply('Seeing as there are only 8 given guesses, don\'t make the word too long.')
                        }
                        if(targets[0].indexOf(' ') != -1) {
                                return this.sendReply('Please don\'t put underscores in the word.');
                        }
                        hangman.reset(room.id);
                        hangman[room.id].hangman = true;
                        var targetword = targets[0].toLowerCase();
                        hangman[room.id].word.push(targetword);
                        hangman[room.id].hangmaner.push(user.userid);
                        for(var i = 0; i < targets[0].length; i++) {
                                hangman[room.id].guessletters.push(targetword[i]);
                                hangman[room.id].underscores.push('_');
                                hangman[room.id].clue[0] = targets[1];
                        }
                        return room.add('|html|<div class = "infobox"><center><font size = 2><b>' + user.name + '</b> started a game of hangman! The word has ' + targets[0].length + ' letters.<br>' + hangman[room.id].underscores.join(" ") + '<br>The category: ' + hangman[room.id].clue[0] + '</font></center></div>');
                }
        },

        viewhangman: function(target, room, user) {
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if (!this.canBroadcast()) return;
                if(hangman[room.id].hangman === false) {
                        return this.sendReply('There is no game of hangman going on right now.');
                }
                this.sendReplyBox('<font size = 2>' + hangman[room.id].underscores.join(" ") + '<br>Guesses left: ' + hangman[room.id].guesses + '<br>Category: ' + hangman[room.id].clue[0] + '</font>');
        },

         topic: 'category',
         category: function(target, room, user) {
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if(hangman === false) {
                        return this.sendReply('There is no game of hangman going on right now.');
                }
                if(user.userid != hangman[room.id].hangmaner[0]) {
                        return this.sendReply('You cannot change the category because you are not running hangman.');
                }
                hangman[room.id].clue[0] = target;
                return this.sendReply('You set the category of hangman to \'' + target + '\'.');
        },


        word: function(target, room, user) {
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if(user.userid === hangman[room.id].hangmaner[0]) {
                        return this.sendReply('Your word is \'' + hangman[room.id].word[0] + '\'.');
                }
                else {
                        return this.sendReply('You are not the person who started hangman.');
                }
        },

        guess: function(target, room, user) {
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if(hangman[room.id].hangman === false) {
                        return this.sendReply('There is no game of hangman going on.');
                }
                if(user.userid === hangman[room.id].hangmaner[0]) {
                        return this.sendReply('You cannot guess because you are running hangman!');
                }
                if(!target) {
                        return this.sendReply('Please specify a letter to guess.');
                }
                if(target.length > 1) {
                        return this.sendReply('Please specify a single letter to guess. To guess the word, use /word.');
                }
                hangman.guess(target,room,user);
        },

        guessword: function(target, room, user) {
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if(hangman[room.id].hangman === false) {
                        return this.sendReply('There is no game of hangman going on.');
                }
                if(!target) {
                        return this.sendReply('Please specify the word you are trying to guess.');
                }
                if(user.userid === hangman[room.id].hangmaner[0]) {
                        return this.sendReply('You cannot guess the word because you are running hangman!');
                }
                hangman.guessword(target,room,user);
        },

        endhangman: function(target, room, user) {
                if(room.id !== 'hangman') {
                                return this.sendReply('Only in hangman room :D');
                }
                if (!user.can('broadcast', null, room)) {
                        return this.sendReply('You do not have enough authority to do this.');
                }
                if(hangman[room.id].hangman === false) {
                        return this.sendReply('There is no game going on.');
                }
                if(hangman[room.id].hangman === true) {
                        room.add('|html|<b>' + user.name + '</b> ended the game of hangman.');
                        hangman.reset(room.id);
                }
        }
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
