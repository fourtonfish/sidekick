/*********************************************************************************
Get to know your Sidekick.

/sidekick help

*********************************************************************************/

var request = require('request');

var fs = require('fs'),
    path = require('path'),
    helpers = require(__dirname + '/../helpers.js'),
    wordfilter = require('wordfilter');

function explain_sidekick(bot, message){

  var attachments = [
    {
      'fallback': 'Unable to render buttons.',
      'callback_id': 'sidekick_actions',
      'color': '#3AA3E3',
      'attachment_type': 'default',
      'actions': [
       
      ]
    }
  ];

  helpers.is_admin(bot, message, function(err){
    attachments[0].actions.push({
      'name': 'actions',
      'text': 'Who\'s online?',
      'type': 'button',
      'value': 'learn_more'
    });

    attachments[0].actions.push({
      'name': 'actions',
      'text': 'Our bots',
      'type': 'button',
      'value': 'learn_more_bots'
    });

    attachments[0].actions.push({
      'name': 'actions',
      'text': 'Contact moderators',
      'type': 'button',
      'value': 'contact_moderators'
    });
        
    if (!err){
      attachments[0].actions.push(
        {
          'name': 'actions',
          'text': 'Cleanup*',
          'type': 'button',
          'value': 'show_cleanup_menu'
        }
      );
    }

    if (err){
      attachments[0].actions.push({
        'name': 'actions',
        'text': 'Delete my account',
        'style': 'danger',
        'type': 'button',
        'value': 'delete_account',
        'confirm': {
          'title': 'Are you sure?',
          'text': 'You can always contact stefan@botwiki.org to re-activate your account.',
          'ok_text': 'Yes',
          'dismiss_text': 'No'
        }
      });
    }    
    
    bot.api.chat.postEphemeral({
      channel:message.channel,
      user: message.user,
      text: 'Hi, I\'m Sidekick! How can I help?',
      'attachments': attachments
    }, function(err, data){
      console.log({err, data});
    });    
  });
}

module.exports = function(controller) {
  controller.hears([
    'who are you',
    'what can you do',
    'help',
    'manual'
  ], 'direct_message,direct_mention', function(bot, message) {
      var message_original = message;
      if (!wordfilter.blacklisted(message.match[1])) {
        explain_sidekick(bot, message);
      } else {
        bot.reply(message, '_sigh_');
      }
  });    
  
  controller.on('slash_command', function(bot, message) {
    bot.replyAcknowledge();

    var {command, args} = helpers.parse_slash_command(message);

    if (command === '' || command === 'help'){
      explain_sidekick(bot, message);
    }
  });
}


