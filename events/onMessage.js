module.exports = function(bot) {

    //
    // Test des dialogues
    //

    var dialogue = {
        last_message: {
            content: null,
            date: null
        },
        last_user: {
            name: null,
            id: null
        }
    };

    /**
     * Est exécuté chaque fois qu'un utilisateur (le bot compris) envoie un message.
     */
    bot.on("message", function(user, userID, channelID, message, event) {

        /**
         * Appel de la librairie de fonctions de l'application.
         */
        var _ = require('../libs/functions.js');

        /**
         * Déclaration des variables
         */
        var date = new Date();
        var hours = ("0" + date.getHours()).slice(-2);
        var minutes = ("0" + date.getMinutes()).slice(-2);
        var seconds = ("0" + date.getSeconds()).slice(-2);
        var timestamp = hours + ":" + minutes + ":" + seconds;



        /* ===========================================================

            Affichage des messages dans la console.
            Inclut les URL des fichiers envoyés.

            TODO : Gérer les messages privés.

         =========================================================== */

        /**
         * Affichage textuel des message dans la console.
         */
        var attachment = "";

        // Si un fichier est envoyé, on récupère son url.
        if(event.d.attachments.length > 0)
            attachment = ` <${event.d.attachments[0].url}> `;

        // Si c'est un message privé, on ne le gère pas. (voir TODO).
        if(!_.isDirectMessage(bot, event))
            console.log(`{${bot.channels[channelID].name}} [${timestamp}] <${user}> ${message} ${attachment}`);



        /* ===========================================================

            Gestion des commandes

         =========================================================== */

        if(message.isCommand()) {

            var command = require('../libs/command.js');
            var output = command.run(event, function(output, error) {

                // Si la commande retourne une erreur, on la gère.
                if(error)
                    console.log(`[ERREUR] ${error}`);

                // Envoi du message s'il existe.
                if(output)
                    bot.sendMessage({ to: channelID, message: output });

            });

        }



        /* ===========================================================

            Gestion des dialogues

         =========================================================== */

        var config = require("../config.json");

        // Le bot est en auto-réponse dans un salon paramétré dans config.json.
        // Dans les autres salons, il faut le mentionner à chaque fois.
        if( (channelID == config.auto_chat_channel || _.isBotMentioned(bot, event) ) && !message.isCommand() && userID != bot.id) {

            dialogue.last_user.name = user;
            dialogue.last_user.id = userID;
            dialogue.last_message.content = message;
            dialogue.last_message.date = Date.now();

            _.getDialogueResponse(message, dialogue, function(response) {
                bot.sendMessage({ to: channelID, message: response, typing: true });
            });

        }

    });

}

console.log('[INFO] onMessage.js chargé.');
