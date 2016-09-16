var dialogue = {
    last_topic: {
        name: null,
        triggered: 1
    },
    last_user: {
        name: null,
        id: null
    }
};

module.exports = function(event, bot) {

    /**
     * Les variables
     */

    // Le contenu du message.
    event.content = event.d.content;

    // Le timestamp du message en ms.
    event.timestamp = new Date(event.d.timestamp);

    // Heure du message formaté.
    var date = new Date(event.d.timestamp);
    event.formated_timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    // Nom du salon.
    event.channel_name = bot.channels[event.d.channel_id].name;

    // ID du Salon.
    event.channel_id = event.d.channel_id;

    // ID du message.
    event.message_id = event.d.id;

    // Mentions
    event.mentions = event.d.mentions;

    // AuthorID du message.
    event.author_id = event.d.author.id;

    // AuthorName du message.
    event.author_name = event.d.author.username;


    /**
     * Les fonctions
     */

    /**
     * Retourne vrai si le bot est mentionné dans un message.
     * @param  {object} bot L'objet complet du bot.
     * @param  {object} event L'objet complet de l'évènement (onMessage).
     * @return {boolean} bool Retourne true si le bot est mentionné, sinon false.
     */
    event.isBotMentioned = function() {

        var mentions = event.d.mentions;

        if(mentions.length > 0) {

            var mentions_id = [];

            // Récupération de tous les ID des mentions.
            for(var i in mentions)
                mentions_id.push(mentions[i].id);

            console.log(mentions_id.indexOf(bot.id));

            if(mentions_id.indexOf(bot.id) != -1) {
                return true;
            }
            else {
                return false;
            }

        }
        else {
            return false;
        }

    };

    /**
     * Retourne si le message est un fichier uploadé.
     * @return {Boolean} bool Retourne true si le message est un fichier, sinon false.
     */
    event.hasAttachments = function() {

        if(event.d.attachments.length > 0)
            return true;
        else
            return false;

    };

     /**
      * Retourne vrai si l'évènement concerne un message privé.
      * @param  {object} bot L'objet complet du bot.
      * @param  {object} event L'objet complet de l'évènement (onMessage).
      * @return {boolean} bool Retourne true si c'est un message privé, sinon false.
      */
    event.isDirectMessage = function() {

        var botDMChannelID = Object.keys(bot.directMessages).toString();
        var channelID = this.d.channel_id;

        if(botDMChannelID === channelID) {
            return true;
        }
        else {
            return false;
        }

     };

     /**
      * Retourne si une chaîne de caractères est une commande ou non.
      * @return {boolean} bool Vrai si la chaîne est une commande, sinon faux.
      */
    event.isCommand = function() {

        var config = require('../config.json');
        var message = event.d.content;

        if(message.indexOf(config.command_prefix) == 0 && message.length > 1) {
            return true;
        }
        else {
            return false;
        }
    };



    /**
     * Consulte tous les topics de l'application est retourne une réponse.
     * @param  {function} callback Le callback contenant la réponse envoyé par le bot.
     */
    event.reply = function(_callback) {

        var fs = require('fs');
        var tools = require("../lib/functions.js")

        var message = event.d.content;

        // JS et les regex sont sensibles à la casse.
        var input = message.toLowerCase();

        // Récupération de la liste de tous les topics.
        var topics = fs.readdirSync(`${__dirname}/../topics/`);

        // On parcourt tous les topics disponibles.
        loop1:
        for(var i in topics) {

            var tpc = require(`${__dirname}/../topics/${topics[i]}`);

            var expressions = tpc.expressions; // Les expressions doivent être en minuscules.

            // Variable de marquage
            var found = false;

            // Si le topic n'a pas d'expressions, on saute au prochain.
            if(!expressions)
                continue;

            // On récupère la liste des expressions.
            for(var key in expressions) {

                if(input.match(expressions[key])) {
                    found = true;

                    /**
                    *
                    * TODO : Revoir le template global (date, heure actuelle, et autres infos...)
                    *
                    */
                    var topic = topics[i].replace(/\.json/, "");

                    // On vérifie si le bot a déjà répondu au topic.
                    if(dialogue.last_topic.name === topic)
                        dialogue.last_topic.triggered++;
                    else
                        // On remet le compteur à zéro si le topic est différent.
                        dialogue.last_topic.triggered = 1;

                    // On autorise une seule répétition.
                    if(dialogue.last_topic.triggered === 3) {
                        var tpc = require(`${__dirname}/../topics/_default.json`);
                        var response = tools.randomize(tpc.already_answered);
                    }
                    else {
                        // On récupère la réponse normale.
                        var response = tools.randomize(tpc.responses);
                    }

                    dialogue.last_topic.name = topic;
                    dialogue.last_user.id = this.author_id;
                    dialogue.last_user.name = this.author_name;

                    // Si l'utilisateur insiste plus de 4 fois, le bot ne répond plus.
                    if(dialogue.last_topic.triggered > 4)
                        response = null;
                    else if(dialogue.last_topic.triggered === 4)
                        response = "...";

                    _callback(response);

                }

                // Si une expression correspond, on arrête de chercher.
                if(found)
                    break loop1;

            }

        }

        // Si le topic n'est pas trouvé.
        if(!found && this.isBotMentioned()) {
            var tpc = require(`${__dirname}/../topics/_default.json`);
            _callback(tools.randomize(tpc.i_do_not_understand));
        }

    };


    /**
     * Filtre un message selon la liste des expressions disponibles dans le fichier
     * config.json. Si un message correspond, il est supprimé.
     */
    event.filterMessage = function() {

        var config = require('../config.json');
        var tpc = require(`${__dirname}/../topics/_default.json`);

        for(var i in config.blacklisted_exp) {

            var exp = config.blacklisted_exp[i].replace("*", "http[s]?:\/\/(.+)?");

            if(this.content.match(exp)) {

                var tools = require("../lib/functions.js")
                var message = tools.randomize(tpc.filtered_message);
                console.log(`${this.content} => matché avec : ${exp}`);

                bot.deleteMessage({ channelID: this.channel_id, messageID: this.message_id });
                bot.sendMessage({ to: this.channel_id, message: `<@${this.author_id}> ${message}` });
            }

        }

    }


    return event;

};
