'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');
const tree = require('./conversationTree.json');

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'mattsmacysbot',
    apiKey: '25ad3bfc-a311-4a0d-8dc6-7ffc8cfdd4a9',
    baseUrl: 'http://45.55.33.104:8000',
    incomingPath: '/incoming'
});

bot.updateBotConfiguration();
console.log('\nset up bot\n');

bot.onTextMessage((message) => {

	var text = message.body;
	var from = message.from;
	
	console.log('Received: \"' + text + '\" from ' + from);
// conversationHandler.handleIncomingMessage(message);
	
	// find the conversation trigger
	for(var i=0; i<tree.messages.length; i++ ){
		if( text.match(RegExp(tree.messages[i].keywords, 'i')) ){
			// conversation trigger found
			
			console.log("from1: " + from);
			
			var messageId = i;
			console.log (tree.messages[messageId].keywords + ' matched for: ' + text);
			
			if( tree.messages[messageId].type == 'text'){
				message.setBody(tree.messages[messageId].text);
			} else if( tree.messages[messageId].type == 'picture'){
				var from = message.from;
				message = Bot.Message.picture(tree.messages[messageId].url)
//					.setText(tree.messages[messageId].text != '' ? tree.messages[messageId].text : '')
					.setAttributionName('Click me')
			    	.setAttributionIcon('http://www1.macys.com/favicon.ico');
				if(tree.messages[messageId].text != ' '){
					bot.send(message, from);
					message = Bot.Message.text(tree.messages[messageId].text);
				}
			} else if( tree.messages[messageId].type == 'video' ||  tree.messages[messageId].type == 'link' ){
				var from = message.from;
				message = Bot.Message.link(tree.messages[messageId].url)
					.setText(tree.messages[messageId].text != '' ? tree.messages[messageId].text : '')
					.setAttributionName('Click me')
			    	.setAttributionIcon('http://www1.macys.com/favicon.ico');
			}
			
			var buttons = [];
			for(var j=0; j<tree.messages[messageId].buttons.length; j++){
				buttons.push(tree.messages[messageId].buttons[j].text);
			}
			
			message.addTextResponse(buttons);
			console.log("from2: " + from + '\n');
			bot.send(message, from);
			
		}else{
//			console.log(tree.messages[i].keywords + ' not matched');
		}
	}
});

// first greeting
bot.onStartChattingMessage((message) => {
    message.reply('Hello! Type \'help\' to see what I can do for you!');
 });


// Set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(8000);
console.log('server started.\n');

